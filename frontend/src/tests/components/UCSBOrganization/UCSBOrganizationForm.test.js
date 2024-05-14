import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm"
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Organization Code", "Organization Name Shortened", "Organization Full Name", "Is Inactive"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`Organization Code`)).toBeInTheDocument();

        const orgTranslationShortInput = await screen.findByTestId(`${testId}-orgTranslationShort`);
        expect(orgTranslationShortInput).toBeInTheDocument();

        const orgTranslationInput = await screen.findByTestId(`${testId}-orgTranslation`);
        expect(orgTranslationInput).toBeInTheDocument();

        const inactiveInput = await screen.findByTestId(`${testId}-inactive`);
        expect(inactiveInput).toBeInTheDocument();

        const submitInput = await screen.findByTestId(`${testId}-submit`);
        expect(submitInput).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("validates 'inactive' field correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
    
        fireEvent.click(submitButton);

        await screen.findByText(/inactive is required/);
    

        const inactiveInput = screen.getByTestId(`${testId}-inactive`);
        fireEvent.change(inactiveInput, { target: { value: "invalid" } });
    

        fireEvent.click(submitButton);
    
  
        await screen.findByText(/Inactive must be 'true' or 'false'./);
    });
    

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required/);
        expect(screen.getByText(/orgTranslationShort is required/)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required/)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length is 30 characters/)).toBeInTheDocument();
        });
    });

});