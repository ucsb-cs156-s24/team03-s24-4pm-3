import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "../../components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

    const objectToAxiosParams = (menuItemReview) => ({
        url: "/api/menuitemreview/post",
        method: "post",
        params: {
            itemId: menuItemReview.itemId,
            reviewerEmail: menuItemReview.reviewerEmail,
            stars: menuItemReview.stars,
            dateReviewed: menuItemReview.dateReviewed,
            comment: menuItemReview.comment
        }
    });

    const onSuccess = (menuItemReview) => {
        toast(`New menuItemReview Created - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId} reviewerEmail: ${menuItemReview.reviewerEmail} stars: ${menuItemReview.stars} dateReviewed: ${menuItemReview.dateReviewed} comment: ${menuItemReview.comment}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/menuitemreview/all"] // mutation makes this key stale so that pages relying on it reload
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/menuitemreview" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New Menu Item Review</h1>
                <MenuItemReviewForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    )
}
