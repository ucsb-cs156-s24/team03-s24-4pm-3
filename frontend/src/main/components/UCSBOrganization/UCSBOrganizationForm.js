import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "UCSBOrganizationForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label htmlFor="orgCode">
              Organization Code
              </Form.Label>
              <Form.Control
                data-testid={testIdPrefix + "-orgCode"}
                id="orgCode"
                type="text"
                isInvalid={Boolean(errors.orgCode)}
                {...register("orgCode", {
                    required: "orgCode is required.",
                    maxLength: {
                    value: 30,
                    message: "Max length is 30 characters."
                    }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.orgCode?.message}
              </Form.Control.Feedback>
            </Form.Group>
    


          <Form.Group className="mb-3">
            <Form.Label htmlFor="orgTranslationShort">
              Organization Name Shortened
            </Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-orgTranslationShort"}
              id="orgTranslationShort"
              type="text"
              isInvalid={Boolean(errors.orgTranslationShort)}
              {...register("orgTranslationShort", {
                required: "orgTranslationShort is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.orgTranslationShort?.message}
            </Form.Control.Feedback>
          </Form.Group>
    


          <Form.Group className="mb-3">
            <Form.Label htmlFor="orgTranslation">
              Organization Full Name 
            </Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-orgTranslation"}
              id="orgTranslation"
              type="text"
              isInvalid={Boolean(errors.orgTranslation)}
              {...register("orgTranslation", {
                required: "orgTranslation is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.orgTranslation?.message}
            </Form.Control.Feedback>
          </Form.Group>
    


          <Form.Group className="mb-3">
            <Form.Label htmlFor="inactive">
            Is Inactive
            </Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-inactive"}
              id="inactive"
              type="Boolean"
              isInvalid={Boolean(errors.inactive)}
              {...register("inactive", {
        required: "inactive is required to be true or false.",
        validate: (value) => {
            if (value === "true" || value === "false") {
                return true;
            }
            return "Inactive must be 'true' or 'false'.";
        }
    })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.inactive?.message}
            </Form.Control.Feedback>
          </Form.Group>
    


          <Button type="submit" data-testid={testIdPrefix + "-submit"}>
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid={testIdPrefix + "-cancel"}
          >Cancel
          </Button>
        </Form>
      );
    }
    
    export default UCSBOrganizationForm;