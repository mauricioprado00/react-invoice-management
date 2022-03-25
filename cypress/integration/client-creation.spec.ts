import { clickLastClientPage, clickNewClientButton, clickSaveClientButton, clientIsInCurrentTablePage, doFillClientProfile, getValidClientProfile, isInClientAddPage, isInClientsPage } from "./client-helpers";
import { isInDashboardPage } from "./dashboard-helpers";
import { givenUserIsLoggedIn } from "./login-helpers";
import { clickClientsMenu, clickDashboardMenu } from "./menu-helpers";

describe("Client Creation", () => {
  it("will show created client in the client list", () => {
    givenUserIsLoggedIn();
    
    clickClientsMenu();
    isInClientsPage();
    
    clickNewClientButton();
    isInClientAddPage();
    
    const profile = getValidClientProfile();
    doFillClientProfile(profile)
    clickSaveClientButton();
    
    // client is visibile in last page of clients listing page
    clickClientsMenu();
    isInClientsPage();

    clickLastClientPage();
    clientIsInCurrentTablePage(profile);

    // client is visibile in dashboard "latest clients" table
    clickDashboardMenu();
    isInDashboardPage();
    clientIsInCurrentTablePage(profile);
    
  })
});

export {};
