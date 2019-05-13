const FakeItems = [
  {
    type: "header",
    content: "A header"
  },
  {
   type: "select",
   id: "id123",
   options: [
     {
       group: 'test group',
       value: 'test value',
       label: 'test label',
     },
     {
       group: 'test group2',
       value: 'test value2',
       label: 'test label2',
     }
   ]
  },
  {
   type: "radio",
   id: "radio1",
   options: [
     {
       value: 'radio value',
       label: 'radio label',
     }
   ],
  },
  {
   type: "radio",
   id: "number1",
   info: "a number"
  },
]

export default FakeItems;