// https://json-generator.com/
[
  '{{repeat(80, 250)}}',
  {
    "user_id": () => "111",
    "invoice_number": "{{company().toUpperCase()}}-{{integer(1000,5000)}}",
    "client_id": function (tags) { return tags.random(CLIENT_ID_LIST).toString(); },
    "date": '{{integer(1609459200000, 1651363200000)}}',
    "dueDate": '{{integer(1609459200000, 1651363200000)}}',
    "projectCode": "{{company().toUpperCase()}}",
    "meta": {
      "details": [
        '{{repeat(1, 5)}}',
        {
          "detail": '{{lorem(3, "words")}}',
          "quantity": '{{integer(1, 10)}}',
          "rate": '{{floating(80.1, 700)}}'
        }
      ],
      "billTo": {
        "name": '{{firstName()}} {{surname()}}',
        "address": '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
        "vatNumber": function (tags) { return tags.integer(9312312312, 931231231200).toString(); },
        "regNumber": function (tags) { return tags.integer(9312312312, 931231231200).toString(); }
      },
      "payTo": {
        "accountType": "swift",
        "accountNumber": "CTCBIDJASBY"
      }
    },
    "value": function () {
      return this.meta.details.reduce((c, d) => c + d.rate * d.quantity, 0);
    },
    "id": "{{guid()}}"
  }
]
