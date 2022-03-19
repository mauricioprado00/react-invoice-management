// https://json-generator.com/
[
  '{{repeat(30, 50)}}',
  {
    "user_id": () => "111",
    name: '{{firstName()}} {{surname()}}',
    email: '{{email()}}',
    avatar: '{{random("1.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png")}}',
    companyDetails: {
      name: '{{company()}}',
      address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
      "vatNumber": function (tags) { return tags.integer(9312312312, 931231231200).toString(); },
      "regNumber": function (tags) { return tags.integer(9312312312, 931231231200).toString(); },
    },
    id: "{{guid()}}",
  },
]
