import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBDiningCommonsMenuItemForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByText(/Dining Commons Code/);
        await screen.findByText(/Create/);
    });


    test("Renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {

        render(
            <Router>
                <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneItem} />
            </Router>
        );
        await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(diningCommonsCodeField, { target: { value: '' } });
        fireEvent.click(submitButton);

        await screen.findByText(/diningCommonsCode is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/diningCommonsCode is required./);
        expect(screen.getByText(/name is required./)).toBeInTheDocument();
        expect(screen.getByText(/station is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");

        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(diningCommonsCodeField, { target: { value: 'PORT' } });
        fireEvent.change(nameField, { target: { value: 'Sushi' } });
        fireEvent.change(stationField, { target: { value: 'Asian' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/diningCommonsCode is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/name is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/station is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
        const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});