# next tasks
- double check :when updating invoice details, the corresponging filtered pages should also be updated. 
- cold loading client page, e.g. http://localhost:3000/client-dashboard?id=18e50f68-0b4c-4c2a-9bdf-5fe9dcedf3ae
- clients should be also sortable and paginable
- add context menu to invoice table
- all clients should be loaded, otherwise client selection list all options.
- Refactor/organize based on [slide for Week 5 Office Hour 1](https://docs.google.com/presentation/d/1pLZ8Zvpyr_myotpvyVYzY5awpUFUO78DE5CnBnVNm7c/edit#slide=id.g117828bad90_0_9)
- Reemplazar hamburget con speed dial https://mui.com/components/speed-dial/
- throwing exception here: invoiceslice: thunkAPI.dispatch(beforeUpdate(prevInvoice)); (missing client)
- if you are in page 10, and filter by client, filters are applied but page is still 10 (unexistant)

# extra:
- add email, phone
- taxes to invoices?
- soft deletion?
- sorted filters? currently api will sort always in the same order. 
  it would be nice to give the user the control of choosing which sorting
  comes first.
# 2022 03 20
- cancel buttons should go back to previous page
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

