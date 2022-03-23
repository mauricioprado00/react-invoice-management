# pending features
1. implement fetching single client (useClientById, same way as useInvoiceById)
4. Refactor/organize based on [slide for Week 5 Office Hour 1](https://docs.google.com/presentation/d/1pLZ8Zvpyr_myotpvyVYzY5awpUFUO78DE5CnBnVNm7c/edit#slide=id.g117828bad90_0_9)
5. latest client invoices in profile (link menu item from client table)
6. deprecate the use of anything with useClientSelector( and useInvoiceSelector(

# unknown bugs: 
- sometimes clients are not being loaded
# known bugs:
- if you are in page 10, and filter by client, filters are applied but page is still 10 (unexistant).
- adding a clients will not keep the client selector sorted.

# extra features:
- automatic configurable due-date amount of days
- add email, phone
- taxes to invoices?
- soft deletion?
- sorted filters? currently api will sort always in the same order. 
  it would be nice to give the user the control of choosing which sorting
  comes first.

# 2022 03 23
1. add latest clients in dashboard
2. implement sorting and pagination of clients
3. pre-fill client selector when creating an invoice from client profile
4. add print icon to invoice table options

# 2022 03 22
- invalidate/modify pages when invoice is created.
- check that page invalidation on add works on all cases.
# 2022 03 21
- all clients should be loaded, otherwise client selection list all options. Fixed:
  - throwing exception here: invoiceslice: thunkAPI.dispatch(beforeUpdate(prevInvoice));
  - cold loading client page, e.g. http://localhost:3000/client-dashboard?id=18e50f68-0b4c-4c2a-9bdf-5fe9dcedf3ae
  - NOT WORKIGN.... double check :when updating invoice details, the corresponging filtered pages should also be updated. 
- Added latest invoices to dashboard

# 2022 03 20
- cancel buttons should go back to previous page
- Reeplaced hamburger custom menu with MUI PopupState Menu https://mui.com/components/menus/#popupstate-helper
- add context menu to invoice table
# 2022 03 19
- Add support in invoice store slice to filter and sort invoices.
- Show more columns in the invoices pages
- Fix total invoices for logged user
- Cold loading invoice view page
- Avoid client data from breaking table layout. 
- when updating invoice details, the corresponging filtered pages should also be updated. 
# 2022 03 18
- created ui for filtering and sorting invoices

# 2022 03 17
- Load invoice information when editing
- Add update functionality for invoices
- Recalculate totalInvoiced for ClientSlice after update operation
- add invoice view/print page

