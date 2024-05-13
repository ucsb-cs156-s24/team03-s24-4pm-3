import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { menuItemReviewFixtures } from "../../../fixtures/menuItemReviewFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "Menu Item ID", "Reviewer Email", "Rating", "Date Reviewed", "Comment"];
    const expectedFields = ["id", "itemId", "reviewerEmail", "stars", "dateReviewed", "comment"];
    const testId = "MenuItemReviewTable";

    test("renders empty table correctly", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuItemReviews={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(fieldElement).not.toBeInTheDocument();
        });
    });

    test("Has the expected column headers, content and buttons for admin user", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(fieldElement).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Has the expected column headers, content for ordinary user", () => {
        // arrange
        const currentUser = currentUserFixtures.userOnly;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Edit button navigates to the edit page", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/menuitemreview/edit/2'));

    });

    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuItemReviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);
    });
});