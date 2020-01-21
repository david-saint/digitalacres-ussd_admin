const sampleData = [
  {
    name: 'Top Level',
    attributes: {
      action: 'NEXT',
    },
    textLayout: { x: 35, y: -10 },
    children: [
      {
        name: 'Level 2: A',
        attributes: {
          action: 'Add Name',
        },
        textLayout: { x: 35, y: -10 },
        children: [
          {
            name: 'Level 3: a',
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 2: A',
                attributes: {
                  action: 'Add Name',
                },
                textLayout: { x: 35, y: -10 },
                children: [
                  {
                    name: 'Level 3: a',
                    textLayout: { x: 35, y: -10 },
                  },
                  {
                    name: 'Level 3: b',
                    textLayout: { x: 35, y: -10 },
                  },
                ],
              },
              {
                name: 'Level 2: B',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
          {
            name: 'Level 3: b',
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 2: A',
                attributes: {
                  action: 'Add Name',
                },
                textLayout: { x: 35, y: -10 },
                children: [
                  {
                    name: 'Level 3: a',
                    textLayout: { x: 35, y: -10 },
                  },
                  {
                    name: 'Level 3: b',
                    textLayout: { x: 35, y: -10 },
                  },
                ],
              },
              {
                name: 'Level 2: B',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
        ],
      },
      {
        name: 'Level 2: B',
        textLayout: { x: 35, y: -10 },
        children: [
          {
            name: 'Level 2: A',
            attributes: {
              action: 'Add Name',
            },
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 3: a',
                textLayout: { x: 35, y: -10 },
              },
              {
                name: 'Level 3: b',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
          {
            name: 'Level 2: B',
            textLayout: { x: 35, y: -10 },
          },
        ],
      },
      {
        name: 'Level 2: B',
        textLayout: { x: 35, y: -10 },
        children: [
          {
            name: 'Level 2: A',
            attributes: {
              action: 'Add Name',
            },
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 3: a',
                textLayout: { x: 35, y: -10 },
              },
              {
                name: 'Level 3: b',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
          {
            name: 'Level 2: B',
            textLayout: { x: 35, y: -10 },
          },
        ],
      },
      {
        name: 'Level 2: B',
        textLayout: { x: 35, y: -10 },
        children: [
          {
            name: 'Level 2: A',
            attributes: {
              action: 'Add Name',
            },
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 3: a',
                textLayout: { x: 35, y: -10 },
              },
              {
                name: 'Level 3: b',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
          {
            name: 'Level 2: B',
            textLayout: { x: 35, y: -10 },
          },
        ],
      },
      {
        name: 'Level 2: B',
        textLayout: { x: 35, y: -10 },
        children: [
          {
            name: 'Level 2: A',
            attributes: {
              action: 'Add Name',
            },
            textLayout: { x: 35, y: -10 },
            children: [
              {
                name: 'Level 3: a',
                textLayout: { x: 35, y: -10 },
              },
              {
                name: 'Level 3: b',
                textLayout: { x: 35, y: -10 },
              },
            ],
          },
          {
            name: 'Level 2: B',
            textLayout: { x: 35, y: -10 },
          },
        ],
      },
    ],
  },
];

export default sampleData;
