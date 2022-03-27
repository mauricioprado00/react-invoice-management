# pending features
4. cypress missing
   6. filtering of invoices
   7. loading mask during invoice filtering
   8. error during invoice filtering
5. some unit testing 
6. make payment selecor an Element (no connection to models)
7. refactor InvoiceForm
8. cypress extra
   1. dashboard loads latest invoices
   2. dahsboard loads latest clients
   3. user profile edition
   4. user profile view
   5. client profile view
   6. invoice print view
   7. logout
9. implement fetching single client (useClientById, same way as useInvoiceById)
10. Refactor/organize based on [slide for Week 5 Office Hour 1](https://docs.google.com/presentation/d/1pLZ8Zvpyr_myotpvyVYzY5awpUFUO78DE5CnBnVNm7c/edit#slide=id.g117828bad90_0_9)
11. latest client invoices in profile (link menu item from client table)
12. deprecate the use of anything with useClientSelector( and useInvoiceSelector(

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

# 2022 03 27
4. cypress missing
   1. test loading mask during client sorting
   2. test error during client sorting
   3. test client pagination
   3. test sorting of invoices
   4. test loading mask during invoice sorting
   5. test error during invoice sorting
   6. test invoice pagination

# 2022 03 26 
- Fix bug when adding client/invoice and total of records not updated in all cached pages
- Fix cached requests in browser. Add cache busting to GET requests. 
# 2022 03 23
1. add latest clients in dashboard
2. implement sorting and pagination of clients
3. pre-fill client selector when creating an invoice from client profile
4. add print icon to invoice table options
5. scroll down to invoices when clicking in client table option "invoices"
6. add some unit test for basic form elements

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

