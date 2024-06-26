import { Button, Form, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm(
        {defaultValues: initialContents || {},}
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line Regex
    const int_regex = /^[0-9]+$/;

    const testIdPrefix = "MenuItemReviewForm";

    return(
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="id">Id</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-id"}
                            id="id"
                            type="number"
                            {...register("id")}
                            value={initialContents.id}
                            disabled
                        />
                    </Form.Group>
                </Col>
            )}

            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="itemId">Menu Item ID</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-itemId"}
                        id="itemId"
                        type="number"
                        isInvalid={Boolean(errors.itemId)}
                        {...register("itemId", {
                            required: "Menu item ID field can't be blank.",
                            pattern: int_regex
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.itemId && "A valid integer is required."}
                        {errors.itemId?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="dateReviewed">Date (iso format)</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-dateReviewed"}
                        id="dateReviewed"
                        type="datetime-local"
                        isInvalid={Boolean(errors.localDateTime)}
                        {...register("dateReviewed", {
                            required: "This field can't be blank.",
                            pattern: isodate_regex
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.dateReviewed && 'A valid date in iso format is required. See more here: https://en.wikipedia.org/wiki/ISO_8601'}
                        {errors.dateReviewed?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="reviewerEmail">Email</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-reviewerEmail"}
                        id="reviewerEmail"
                        type="text"
                        isInvalid={Boolean(errors.reviewerEmail)}
                        {...register("reviewerEmail", {
                            required: "Your email is required",
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.reviewerEmail?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="stars">Stars</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-stars"}
                        id="stars"
                        type="number"
                        isInvalid={Boolean(errors.stars)}
                        {...register("stars", {
                            required: "A valid number is required.",
                            min: {
                                value: 1,
                                message: "Minimum 1 star"
                            },
                            max: {
                                value: 5,
                                message: "Maximum 5 stars"
                            },
                            pattern: int_regex
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.stars && 'A valid integer between 1 and 5 is required. '}
                        {errors.stars?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comment">Comment</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-comment"}
                    id="comment"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("comment", {
                        required: "A comment is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comment?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>
    )
}
export default MenuItemReviewForm;