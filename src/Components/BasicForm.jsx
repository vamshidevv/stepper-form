import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressForm from "./AddressForm";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(5, "Name must contain at least 5 characters"),
  middle: yup.string().required("Middle name is required"),
  lastname: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/i, "Name cannot contain numbers"),
  contact_number: yup
    .string()
    .required("Enter Contact Number")
    .matches(/^\d{10}$/, "Mobile No must be exactly 10 digits"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  dob: yup.string().required("Date of Birth is required"),
  place_of_birth: yup.string().required("Place of Birth is required"),
  gender: yup.string().required("Gender is required"),
  blood_group: yup.string().required("Blood Group is required"),
  marital_status: yup.string().required("Marital Status is required"),
});

export default function BasicForm({ updateActiveStep }) {
  const [isClicked, setIsClicked] = useState(false);
  const [fields, setFields] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/step_1");
        setFields(response.data.fields);
      } catch (error) {
        console.error("Error fetching the data: ", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = (data) => {
    console.log("Data:", JSON.stringify(data, null, 2));
  };

  const nextClicked = () => {
    updateActiveStep(1);
    setIsClicked(true);
    // console.log("Data:", JSON.stringify(data, null, 2));
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "calendar":
        return (
          <input
            className="input"
            type={field.type === "calendar" ? "date" : field.type}
            {...register(field.name)}
          />
        );
      case "radio":
        return field.options.map((option) => (
          <label key={option.value}>
            <input
              style={{ marginLeft: "1rem" }}
              type="radio"
              value={option.value}
              {...register(field.name)}
            />
            {option.label}
          </label>
        ));
      case "select":
        return (
          <select
            {...register(field.name)}
            className="input"
            id="custom-select"
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  // Watch all form fields to determine form completion status
  const watchAllFields = watch();

  const isFormComplete = fields.every((field) => !!watchAllFields[field.name]);

  return (
    <>
      {isClicked ? (
        <AddressForm />
      ) : (
        <Container
          maxWidth="sm"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <form className="form" onChange={handleSubmit(onSubmit)}>
            {fields.length > 0 ? (
              fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <div className="render-fields">{renderField(field)}</div>
                  {errors[field.name] && (
                    <span className="error">{errors[field.name].message}</span>
                  )}
                  <br />
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
            <button
              className={isFormComplete ? "sub" : "submit"}
              type="submit"
              disabled={!isFormComplete}
              onClick={nextClicked}
            >
              Next
            </button>
          </form>
        </Container>
      )}
    </>
  );
}
