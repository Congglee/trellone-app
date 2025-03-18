import { BoardResType } from '~/schemas/board.schema'

export const mockBoardsList: BoardResType['result'][] = [
  {
    _id: 'board-id-01',
    title: 'Conggglee Trellone Board',
    description: 'This is a board description',
    type: 'public',
    cover_photo: 'https://images6.alphacoders.com/138/thumbbig-1386838.webp',
    workspace_id: 'workspace-id-01',
    column_order_ids: ['column-id-01', 'column-id-02', 'column-id-03'],
    owners: [],
    members: [],
    _destroy: false,
    created_at: new Date('2023-10-01T00:00:00.000Z'),
    updated_at: new Date('2023-10-01T00:00:00.000Z')
  }
]

export const mockBoardDetails: BoardResType['result'] = {
  _id: 'board-id-01',
  title: 'Conggglee Trellone Board',
  description: 'This is a board description',
  type: 'public',
  cover_photo: 'https://images6.alphacoders.com/138/thumbbig-1386838.webp',
  workspace_id: 'workspace-id-01',
  column_order_ids: ['column-id-01', 'column-id-02', 'column-id-03', 'column-id-04'],
  owners: [],
  members: [],
  columns: [
    {
      _id: 'column-id-01',
      board_id: 'board-id-01',
      title: 'To Do',
      card_order_ids: [
        'card-id-01',
        'card-id-02',
        'card-id-03',
        'card-id-05',
        'card-id-04',
        'card-id-06',
        'card-id-07'
      ],
      cards: [
        {
          _id: 'card-id-01',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 1',
          description: 'Description of card 1',
          cover_photo: 'https://i.pinimg.com/736x/fb/f1/3f/fbf13f430dc38e72ee0cee141c7e2ff2.jpg',
          members: ['user-id-01'],
          comments: [
            {
              user_id: 'user-id-01',
              user_email: 'testuser01@gmail.com',
              user_avatar: '',
              user_display_name: 'Test User 01',
              content: 'This is a comment',
              commented_at: new Date('2023-10-01T00:00:00.000Z')
            },
            {
              user_id: 'user-id-01',
              user_email: 'testuser01@gmail.com',
              user_avatar: '',
              user_display_name: 'Test User 01',
              content: 'This is another comment',
              commented_at: new Date('2023-10-01T00:00:00.000Z')
            }
          ],
          attachments: ['test attachment 01', 'test attachment 02'],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-02',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 2',
          description: 'Description of card 2',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-03',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 3',
          description: 'Description of card 3',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-04',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 4',
          description: 'Description of card 4',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-05',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 5',
          description: 'Description of card 5',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-06',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 6',
          description: 'Description of card 6',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-07',
          board_id: 'board-id-01',
          column_id: 'column-id-01',
          title: 'Title of card 7',
          description: 'Description of card 7',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        }
      ],
      _destroy: false,
      created_at: new Date('2023-10-01T00:00:00.000Z'),
      updated_at: new Date('2023-10-01T00:00:00.000Z')
    },
    {
      _id: 'column-id-02',
      board_id: 'board-id-01',
      title: 'In Progress',
      card_order_ids: ['card-id-08', 'card-id-09', 'card-id-10'],
      cards: [
        {
          _id: 'card-id-08',
          board_id: 'board-id-01',
          column_id: 'column-id-02',
          title: 'Title of card 8',
          description: 'Description of card 8',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-09',
          board_id: 'board-id-01',
          column_id: 'column-id-02',
          title: 'Title of card 9',
          description: 'Description of card 9',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-10',
          board_id: 'board-id-01',
          column_id: 'column-id-02',
          title: 'Title of card 10',
          description: 'Description of card 10',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        }
      ],
      _destroy: false,
      created_at: new Date('2023-10-01T00:00:00.000Z'),
      updated_at: new Date('2023-10-01T00:00:00.000Z')
    },
    {
      _id: 'column-id-03',
      board_id: 'board-id-01',
      title: 'Done',
      card_order_ids: ['card-id-11', 'card-id-12', 'card-id-13'],
      cards: [
        {
          _id: 'card-id-11',
          board_id: 'board-id-01',
          column_id: 'column-id-03',
          title: 'Title of card 11',
          description: 'Description of card 11',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-12',
          board_id: 'board-id-01',
          column_id: 'column-id-03',
          title: 'Title of card 12',
          description: 'Description of card 12',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        },
        {
          _id: 'card-id-13',
          board_id: 'board-id-01',
          column_id: 'column-id-03',
          title: 'Title of card 13',
          description: 'Description of card 13',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z')
        }
      ],
      _destroy: false,
      created_at: new Date('2023-10-01T00:00:00.000Z'),
      updated_at: new Date('2023-10-01T00:00:00.000Z')
    },
    {
      _id: 'column-id-04',
      board_id: 'board-id-01',
      title: 'Archived',
      card_order_ids: ['column-id-04-placeholder-card'],
      cards: [
        {
          _id: 'column-id-04-placeholder-card',
          board_id: 'board-id-01',
          column_id: 'column-id-04',
          title: 'Placeholder Card',
          description: 'This is a placeholder card',
          cover_photo: '',
          members: [],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2023-10-01T00:00:00.000Z'),
          updated_at: new Date('2023-10-01T00:00:00.000Z'),
          FE_PlaceholderCard: true
        }
      ],
      _destroy: false,
      created_at: new Date('2023-10-01T00:00:00.000Z'),
      updated_at: new Date('2023-10-01T00:00:00.000Z')
    }
  ],
  _destroy: false,
  created_at: new Date('2023-10-01T00:00:00.000Z'),
  updated_at: new Date('2023-10-01T00:00:00.000Z')
}
