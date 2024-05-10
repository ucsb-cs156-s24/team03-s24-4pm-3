import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticleForm from "main/components/Articles/ArticleForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticleForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await screen.findByText(/Title of Article/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Article", async () => {

        render(
            <Router  >
                <ArticleForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(/ArticleForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticleForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await screen.findByTestId("ArticleForm-dateAdded");
        const localDateTimeField = screen.getByTestId("ArticleForm-dateAdded");
        const submitButton = screen.getByTestId("ArticleForm-submit");

        fireEvent.change(localDateTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);


    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await screen.findByTestId("ArticleForm-submit");
        const submitButton = screen.getByTestId("ArticleForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticleForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticleForm-title");

        const titleField = screen.getByTestId("ArticleForm-title");
        const urlField = screen.getByTestId("ArticleForm-url");
        const emailField = screen.getByTestId("ArticleForm-email");
        const localDateTimeField = screen.getByTestId("ArticleForm-dateAdded");
        const explanationField = screen.getByTestId("ArticleForm-explanation");
        const submitButton = screen.getByTestId("ArticleForm-submit");

        fireEvent.change(titleField, { target: { value: 'test1' } });
        fireEvent.change(urlField, { target: { value: 'test1.com' } });
        fireEvent.change(emailField, { target: { value: 'test1@ucsb.edu' } });
        fireEvent.change(localDateTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'testtesttest' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());


    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await screen.findByTestId("ArticleForm-cancel");
        const cancelButton = screen.getByTestId("ArticleForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


