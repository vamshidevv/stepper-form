import { Container, TextField } from "@material-ui/core";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ParentalDetails } from "./ParentalDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  address_line_1: yup
    .string()
    .required("address line 1 is required")
    .min(5, "Name must contain at least 5 characters"),
  address_line_2: yup.string().required("Address line 2 is required"),
  landmark: yup.string().required("Landmark is required"),
  state: yup.string().required("State is required "),
  city: yup.string().required("City is required "),
  Pincode: yup
    .string()
    .required("Pincode is required ")
    .matches(/^[0-9]+$/i, "Pincode cannot contain characters"),
});
const AddressForm = ({ updateActiveStep }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [fields, setFields] = useState([]);

  const onSubmit = (data) => {
    console.log("Address:", JSON.stringify(data, null, 2));
    setIsClicked(true);
    updateActiveStep(2);
  };

  useEffect(() => {
    const checkFormCompletion = () => {
      const isFormComplete = fields.every((field) => !!field.value);
      setFormCompleted(isFormComplete);
    };
    checkFormCompletion();
  }, [fields]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/step_2");
        setFields(
          response.data.fields.map((field) => ({ ...field, value: "" }))
        );
      } catch (error) {
        console.error("Error fetching the data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], value };
    setFields(updatedFields);
  };

  // const NextClicked = () => {
  //   setIsClicked(true);
  // };

  return (
    <>
      {isClicked === true ? (
        <ParentalDetails />
      ) : (
        <>
          <Container
            maxWidth="sm"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {fields.length > 0 ? (
                fields.map((field, index) => (
                  <div key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <TextField
                      {...register(field.name)}
                      className="input"
                      style={{ marginBottom: "1rem" }}
                      value={field.value}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    {errors[field.name] && (
                      <span className="error">
                        {errors[field.name].message}
                      </span>
                    )}
                    <br />
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}

              <button
                type="submit"
                className={formCompleted === true ? "sub" : "submit"}
                disabled={!formCompleted}
                // onClick={NextClicked}
              >
                Next
              </button>
            </form>
          </Container>
        </>
      )}
    </>
  );
};

export default AddressForm;
