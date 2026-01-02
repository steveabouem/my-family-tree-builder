import { Trans } from "@lingui/macro";
import { Button } from "@mui/material";
import BoxRow from "components/common/containers/column";
import BoxColumn from "components/common/containers/row/BoxColumn";
// @ts-ignore
import styled from 'styled-components';
import { useFormikContext } from "formik";
import { useContext, useState } from "react";
import LocalSpinner from "components/common/progressIndicators/LocalSpinner";
import GlobalContext from "contexts/creators/global";

const ImageField = (fieldProps: any) => {
  const [preview, setPreview] = useState<string | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const { setFieldValue } = useFormikContext<any>();
  const { updateModal } = useContext(GlobalContext)

  function handlePreview(e: any) {
    const img = e.target.files?.[0];

    if (img) {
      if ((img?.size / 1024) > 999) {
        updateModal({
          title: <Trans>image_too_large_modal_title</Trans>,
          buttons: { cancel: true, confirm: false },
          content: <Trans>image_too_large_text</Trans>,
          type: 'warning',
          hidden: false
        });

        return;
      } else {
        const reader = new FileReader();

        reader.onloadstart = (() => {
          setUploading(true);
        });
        reader.onloadend = (() => {
          const encodedImg = reader.result as string;

          setUploading(false);
          setFieldValue(fieldProps.name, encodedImg);
          setPreview(encodedImg);
        });
        reader.readAsDataURL(img);
      }
    } else {
      setPreview(undefined);
    }
  }

  return (
    <BoxColumn>
      <input accept="image" type="file" onChange={handlePreview} />
      {uploading && <LocalSpinner loading={true} size={90} />}
      {preview && (
        <PreviewContainer>
          <Preview src={preview} />
          {/* <Button variant="outlined" color="primary" onClick={handleUpload}><Trans>upload</Trans></Button> */}
        </PreviewContainer>
      )}
    </BoxColumn>
  );
};

const PreviewContainer = styled(BoxRow)`
  background: #b6a7a72e;
  padding: 1em;
`;
const Preview = styled.img`
height: 100px;
width: 100px;
`;
export default ImageField;