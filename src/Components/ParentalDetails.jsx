import { Container } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const ParentalDetails = () => {
  const [fields, setFields] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("parental:", JSON.stringify(data, null, 2)); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/step_3");
        setFields(
          response.data.fields.map((field) => ({ ...field, value: "" }))
        );
      } catch (error) {
        console.error("Error fetching the data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkFormCompletion = () => {
      const isFormComplete = fields.every((field) => !!field.value);
      setFormCompleted(isFormComplete);
    };
    checkFormCompletion();
  }, [fields]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], value };
    setFields(updatedFields);
  };

  return (
    <>
      <Container maxWidth="sm" style={{display:"flex",justifyContent:"center"}}>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {fields.map((field,index) => {
            return (
              <>
                <div key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    {...register(field.name)}
                    className="input"
                    style={{ marginBottom: "1rem" }}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  {errors[field.name] && (
                    <span className="error">{errors[field.name].message}</span>
                  )}
                  <br />
                </div>
              </>
            );
          })}
          <input type="submit" className={formCompleted === true ? "sub" : "submit"} disabled={!formCompleted}/>
        </form>
      </Container>
    </>
  );
};
