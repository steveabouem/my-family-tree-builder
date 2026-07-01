import React, { useState } from 'react';
import ('./styles.scss');

const secret = 'spam';
const initialAttempts = {
  1: [  ],
  2: [  ],
  3: [  ],
  4: [  ],
  5: [  ]
};
/**
 * 
 * @returns Assignment was in js so  no need to worry about typing
 */
export default function Wordle() {
  const [attempts, setAttempts] = useState<any>(initialAttempts);

  function assignCharColor(c: string) {
    const charPosition = secret.indexOf(c);
    const isValid = charPosition >= 0;
    const currentAttempt: any = Object.keys(attempts).find(a => attempts[a].length < 5);
    const attemptCharPosition = attempts[currentAttempt]?.length;
    let color = '';
    console.log({ charPosition, isValid, currentAttempt, attemptCharPosition })

    if (isValid) {
      if (attemptCharPosition === charPosition) {
        color = 'green';
      } else {
        color = 'yellow';
      }
    } else {
      color = 'red';
    }

    setAttempts((prev: any) => {
      return ({ ...prev, [currentAttempt]: [...prev[currentAttempt], {value: c, color}] });
    });
  }

  function evalInput(e: any) {
    const inputValue = e.key;
    const color = assignCharColor(inputValue);
    console.log({ color })
  }

  function renderAttempt(a: any) {
    console.log({a})
    return (
      <div className='attempts-row'>
        {attempts[a].map((letter: any, index: number) => {
          return <div key={index} style={{ color: letter?.color || '' }}>{letter?.value || '*'}</div>
        })}
      </div>
    );
  }

  return (
    <div className='page'>
      <div className='attempts-grid'>
        {Object.keys(attempts).map(a => (
          <>
            {renderAttempt(a)}
          </>
        ))}
      </div>
      <input onKeyDown={evalInput} />
    </div>
  )
}