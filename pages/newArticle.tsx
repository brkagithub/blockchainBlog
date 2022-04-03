import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { LayoutItemSafe } from "@/components/UI/Layout";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";
import { styled } from "@mui/system";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Checkbox, useRadioGroup } from "@mui/material";
import { InputRounded } from "@mui/icons-material";
import { setArticleMoralis } from "@/helpers/articles";
import { useMoralis } from "react-moralis";
import MDEditor from "@uiw/react-md-editor";

interface IFormInputs {
  title: string;
  mdxContent: string;
  previewPictureURL: string;
  mdEditor: string;
}

const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 100%;
  font-size: 1.75rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  border: none;
  line-height: 1.5;
  padding: 12px 12px;

  &:focus {
    outline: none;
    border: none;
  }
`
);

const StyledTextareaElement = styled("textarea")(
  ({ theme }) => `
  width: 100%;
  height: 100%;
  font-size: 1.75rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  border: none;
  padding: 12px 12px;
  overflow: hidden;

  &:focus {
    outline: none;
    border: none;
  }
`
);

const CustomInput = React.forwardRef(function CustomInput(
  props: InputUnstyledProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
      autoFocus={true}
    />
  );
});

const CustomTextarea = React.forwardRef(function CustomTextarea(
  props: InputUnstyledProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <InputUnstyled
      components={{ Input: StyledTextareaElement }}
      {...props}
      ref={ref}
      autoFocus={false}
    />
  );
});

const NewArticle = () => {
  const { user, Moralis } = useMoralis();

  const [published, setPublished] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const slug = data.title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join("");

    /*const result = await setArticleMoralis(
      slug,
      data.title,
      data.mdxContent,
      user?.id ? user.id : "",
      Moralis
    );*/

    const response = await fetch("/api/articles/created", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        title: data.title,
        mdxContent: data.mdxContent,
        previewPictureURL: data.previewPictureURL,
        userId: user?.id ? user.id : "",
      }),
    });

    console.log(response.body);

    reset();
  };

  return (
    <LayoutItemSafe sx={{ width: 1 }}>
      <Box
        component="form"
        sx={{
          width: "70%",
          height: "100%",
        }}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CustomInput placeholder="Your title..." {...field} />
          )}
        />

        <Controller
          name="previewPictureURL"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CustomInput placeholder="Your preview picture..." {...field} />
          )}
        />

        <Controller
          name="mdxContent"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CustomTextarea placeholder="Your markdown..." {...field} />
            /*<Input
              disableUnderline={true}
              placeholder="Your markdown..."
              minRows={3}
              multiline={true}
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "1.75rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                fontWeight: "700",
                padding: "12px 12px",
                overflow: "hidden",
              }}
            ></Input>*/
          )}
        />

        <Button
          type="submit"
          variant={"contained"}
          sx={{
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: "700",
            ml: "12px",
          }}
        >
          Publish
        </Button>
      </Box>
    </LayoutItemSafe>
  );
};

export default NewArticle;
