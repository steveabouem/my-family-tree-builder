import React, { useContext, useEffect, useState } from "react";
import { Field, FieldArray, Formik } from "formik";
import BaseFormFields from "../common/forms/BaseFormFields";
import { DSibling, DTreeManagerFields, DTreeManagerProps, relationType } from "./definitions";
import { DFormField } from "../common/definitions";
import BaseDropDown from "../common/dropdowns/BaseDropdown";
import { DDropdownOption, relationOptions } from "../common/dropdowns/definitions";

const ManageTreeForm = ({ hasSiblings, hasSpouse }: DTreeManagerProps): JSX.Element => {
  // !: For now I will not distinguish between the 2.Will use fam as central entity (seen README)
  // ? single form here to build the treeManagerFormFields. I might add an option on each tree node to allow adding a link for that specific Node. 
  // ? hat will allow for extended families without having to also deal with the families endpoint **/
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string | number }>({
    relation: 'Father',
  });
  const [motherName, setMotherName] = useState<string>('');
  const [siblinsList, setSiblinsList] = useState<DSibling[]>([]);

  useEffect(() => {
    if (displayValues.relation) { }
  }, [displayValues.relation]);

  const treeManagerInitialValues: DTreeManagerFields = {
    first_name: '',
    last_name: '',
    relation: '',
    siblings: [],
    marital_status: ''
  }

  const submitForm = (values: DTreeManagerFields) => {

  }

  return (
    <div>
      <Formik
        initialValues={treeManagerInitialValues}
        onSubmit={submitForm}
      >
        {({ handleSubmit, errors, isSubmitting, setFieldValue, values }) => (
          <>
            <div className="row">
              <div className="col">
                <label>First name</label> <Field name="first_name" />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label>Last name</label> <Field name="last_name" />
              </div>
            </div>

            {hasSiblings ? 
              <div className="col">
                <label>Siblings</label> <FieldArray name="siblings" render={siblings => (
                  <div className="row">
                    <div className="col">
                      <label>first_name</label>
                      <input name="siblings[x].first_name" />
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>last_name</label>
                        <input name="siblings[x].last_name" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>age</label>
                        <input name="siblings[x].age" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>occupation</label>
                        <input name="siblings[x].occupation" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>partner</label>
                        <input name="siblings[x].partner" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>marital_status</label>
                        <input name="input[x].marital_status" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>is_parent</label>
                        <input name="siblings[x].is_parent" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>gender</label>
                        <input name="siblings[x].gender" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label>profile_url</label>
                        <input name="siblings[x].profile_url" />
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col">
                        <label>email</label>
                        <input name="siblings[x].email" />
                      </div>
                    </div> */}

                    <div className="row">
                      <div className="col">
                        <label>relation</label>
                        <input name="siblings[x].relation" />
                      </div>
                    </div>
                  </div>
                )} />
              </div>
              : null}
            {/* // <div className="row">
            //   <div className="col">
            //     <label>Marital status</label> <Field name="marital_status" />
            //   </div>
            // </div> */}

          </>
        )}
      </Formik>
    </div >

  );
}
export default ManageTreeForm;