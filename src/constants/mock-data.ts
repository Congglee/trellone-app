import { BoardVisibility } from '~/constants/type'
import type { BoardType } from '~/schemas/board.schema'

export const MOCK_BOARD_DATA: BoardType = {
  _id: 'mock-board-id',
  title: 'Product Launch 2024',
  description: 'Plan and execute our Q1 product launch with cross-functional collaboration.',
  visibility: BoardVisibility.Public,
  cover_photo: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200',
  background_color: '',
  workspace_id: 'mock-workspace-id',
  column_order_ids: ['col-todo', 'col-progress', 'col-review', 'col-done'],
  members: [
    {
      _id: 'user-1',
      email: 'alice@example.com',
      username: 'alice_johnson',
      display_name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      is_active: true,
      verify: 1,
      _destroy: false,
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-15'),
      user_id: 'user-1',
      role: 'Admin',
      joined_at: new Date('2024-01-15'),
      invited_by: undefined
    },
    {
      _id: 'user-2',
      email: 'bob@example.com',
      username: 'bob_smith',
      display_name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      is_active: true,
      verify: 1,
      _destroy: false,
      created_at: new Date('2024-01-16'),
      updated_at: new Date('2024-01-16'),
      user_id: 'user-2',
      role: 'Member',
      joined_at: new Date('2024-01-16'),
      invited_by: 'user-1'
    },
    {
      _id: 'user-3',
      email: 'carol@example.com',
      username: 'carol_williams',
      display_name: 'Carol Williams',
      avatar: 'https://i.pravatar.cc/150?img=3',
      is_active: true,
      verify: 1,
      _destroy: false,
      created_at: new Date('2024-01-17'),
      updated_at: new Date('2024-01-17'),
      user_id: 'user-3',
      role: 'Member',
      joined_at: new Date('2024-01-17'),
      invited_by: 'user-1'
    },
    {
      _id: 'user-4',
      email: 'david@example.com',
      username: 'david_brown',
      display_name: 'David Brown',
      avatar: 'https://i.pravatar.cc/150?img=4',
      is_active: true,
      verify: 1,
      _destroy: false,
      created_at: new Date('2024-01-18'),
      updated_at: new Date('2024-01-18'),
      user_id: 'user-4',
      role: 'Observer',
      joined_at: new Date('2024-01-18'),
      invited_by: 'user-2'
    }
  ],
  columns: [
    {
      _id: 'col-todo',
      board_id: 'mock-board-id',
      title: 'To Do',
      card_order_ids: ['card-1', 'card-2', 'card-3'],
      cards: [
        {
          _id: 'card-1',
          board_id: 'mock-board-id',
          column_id: 'col-todo',
          title: 'Design landing page mockups',
          description: 'Create initial mockups for the new product landing page',
          due_date: new Date('2024-02-15'),
          is_completed: null,
          cover_photo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
          members: ['user-1', 'user-2'],
          comments: [
            {
              comment_id: 'comment-1',
              user_id: 'user-1',
              user_email: 'alice@example.com',
              user_avatar: 'https://i.pravatar.cc/150?img=1',
              user_display_name: 'Alice Johnson',
              content: "Great start! Let's ensure we include mobile views as well.",
              commented_at: new Date('2024-02-01T10:30:00'),
              reactions: [
                {
                  reaction_id: 'reaction-1',
                  emoji: '👍',
                  user_id: 'user-2',
                  user_email: 'bob@example.com',
                  user_display_name: 'Bob Smith',
                  reacted_at: new Date('2024-02-01T11:00:00')
                }
              ]
            }
          ],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-01'),
          updated_at: new Date('2024-02-01')
        },
        {
          _id: 'card-2',
          board_id: 'mock-board-id',
          column_id: 'col-todo',
          title: 'Set up development environment',
          description: '',
          due_date: new Date('2024-02-10'),
          is_completed: null,
          cover_photo: undefined,
          members: ['user-3'],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-02'),
          updated_at: new Date('2024-02-02')
        },
        {
          _id: 'card-3',
          board_id: 'mock-board-id',
          column_id: 'col-todo',
          title: 'Write technical specifications',
          description: 'Document API endpoints and database schema',
          due_date: new Date('2024-02-20'),
          is_completed: null,
          cover_photo: undefined,
          members: ['user-2'],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-03'),
          updated_at: new Date('2024-02-03')
        }
      ],
      _destroy: false,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20')
    },
    {
      _id: 'col-progress',
      board_id: 'mock-board-id',
      title: 'In Progress',
      card_order_ids: ['card-4', 'card-5'],
      cards: [
        {
          _id: 'card-4',
          board_id: 'mock-board-id',
          column_id: 'col-progress',
          title: 'Implement user authentication',
          description: 'Add login, signup, and password reset functionality',
          due_date: new Date('2024-02-18'),
          is_completed: null,
          cover_photo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
          members: ['user-1', 'user-3'],
          comments: [
            {
              comment_id: 'comment-2',
              user_id: 'user-1',
              user_email: 'alice@example.com',
              user_avatar: 'https://i.pravatar.cc/150?img=1',
              user_display_name: 'Alice Johnson',
              content: 'OAuth integration is complete, working on JWT now.',
              commented_at: new Date('2024-02-05T14:20:00'),
              reactions: [
                {
                  reaction_id: 'reaction-2',
                  emoji: '🚀',
                  user_id: 'user-3',
                  user_email: 'carol@example.com',
                  user_display_name: 'Carol Williams',
                  reacted_at: new Date('2024-02-05T14:25:00')
                }
              ]
            }
          ],
          attachments: [
            {
              attachment_id: 'att-1',
              type: 'FILE',
              uploaded_by: 'user-1',
              file: {
                url: 'https://example.com/files/auth-spec.pdf',
                display_name: 'Authentication Specification',
                mime_type: 'application/pdf',
                size: 245760,
                original_name: 'auth-spec.pdf'
              },
              link: {
                url: '',
                display_name: '',
                favicon_url: ''
              },
              added_at: new Date('2024-02-04')
            }
          ],
          _destroy: false,
          created_at: new Date('2024-02-04'),
          updated_at: new Date('2024-02-05')
        },
        {
          _id: 'card-5',
          board_id: 'mock-board-id',
          column_id: 'col-progress',
          title: 'Build dashboard UI components',
          description: 'Create reusable components for the main dashboard',
          due_date: new Date('2024-02-25'),
          is_completed: null,
          cover_photo: undefined,
          members: ['user-2'],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-05'),
          updated_at: new Date('2024-02-05')
        }
      ],
      _destroy: false,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20')
    },
    {
      _id: 'col-review',
      board_id: 'mock-board-id',
      title: 'In Review',
      card_order_ids: ['card-6', 'card-7'],
      cards: [
        {
          _id: 'card-6',
          board_id: 'mock-board-id',
          column_id: 'col-review',
          title: 'Optimize database queries',
          description: 'Review and optimize slow queries identified in production',
          due_date: new Date('2024-02-12'),
          is_completed: null,
          cover_photo: undefined,
          members: ['user-3', 'user-4'],
          comments: [
            {
              comment_id: 'comment-3',
              user_id: 'user-4',
              user_email: 'david@example.com',
              user_avatar: 'https://i.pravatar.cc/150?img=4',
              user_display_name: 'David Brown',
              content: 'Query response time improved by 60%. Ready for review.',
              commented_at: new Date('2024-02-08T09:15:00'),
              reactions: []
            }
          ],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-06'),
          updated_at: new Date('2024-02-08')
        },
        {
          _id: 'card-7',
          board_id: 'mock-board-id',
          column_id: 'col-review',
          title: 'Code review for PR #1247',
          description: 'Review the new feature branch before merging',
          due_date: new Date('2024-02-14'),
          is_completed: null,
          cover_photo: undefined,
          members: ['user-1'],
          comments: [
            {
              comment_id: 'comment-4',
              user_id: 'user-1',
              user_email: 'alice@example.com',
              user_avatar: 'https://i.pravatar.cc/150?img=1',
              user_display_name: 'Alice Johnson',
              content: 'LGTM, just one minor suggestion in the comments.',
              commented_at: new Date('2024-02-09T16:45:00'),
              reactions: []
            }
          ],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-02-07'),
          updated_at: new Date('2024-02-09')
        }
      ],
      _destroy: false,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20')
    },
    {
      _id: 'col-done',
      board_id: 'mock-board-id',
      title: 'Done',
      card_order_ids: ['card-8', 'card-9', 'card-10'],
      cards: [
        {
          _id: 'card-8',
          board_id: 'mock-board-id',
          column_id: 'col-done',
          title: 'Setup CI/CD pipeline',
          description: 'Configure automated testing and deployment',
          due_date: new Date('2024-02-08'),
          is_completed: true,
          cover_photo: undefined,
          members: ['user-2'],
          comments: [
            {
              comment_id: 'comment-5',
              user_id: 'user-2',
              user_email: 'bob@example.com',
              user_avatar: 'https://i.pravatar.cc/150?img=2',
              user_display_name: 'Bob Smith',
              content: 'Pipeline is live and running smoothly! 🎉',
              commented_at: new Date('2024-02-08T12:00:00'),
              reactions: [
                {
                  reaction_id: 'reaction-3',
                  emoji: '🎉',
                  user_id: 'user-1',
                  user_email: 'alice@example.com',
                  user_display_name: 'Alice Johnson',
                  reacted_at: new Date('2024-02-08T12:05:00')
                }
              ]
            }
          ],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-01-28'),
          updated_at: new Date('2024-02-08')
        },
        {
          _id: 'card-9',
          board_id: 'mock-board-id',
          column_id: 'col-done',
          title: 'Create project documentation',
          description: 'Write user guide and API documentation',
          due_date: new Date('2024-02-05'),
          is_completed: true,
          cover_photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
          members: ['user-3'],
          comments: [],
          attachments: [
            {
              attachment_id: 'att-2',
              type: 'LINK',
              uploaded_by: 'user-3',
              file: {
                url: '',
                display_name: '',
                mime_type: '',
                size: 0,
                original_name: ''
              },
              link: {
                url: 'https://docs.example.com',
                display_name: 'Project Documentation',
                favicon_url: 'https://docs.example.com/favicon.ico'
              },
              added_at: new Date('2024-02-05')
            }
          ],
          _destroy: false,
          created_at: new Date('2024-01-30'),
          updated_at: new Date('2024-02-05')
        },
        {
          _id: 'card-10',
          board_id: 'mock-board-id',
          column_id: 'col-done',
          title: 'Design brand identity',
          description: 'Create logo, color palette, and brand guidelines',
          due_date: new Date('2024-02-01'),
          is_completed: true,
          cover_photo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
          members: ['user-1'],
          comments: [],
          attachments: [],
          _destroy: false,
          created_at: new Date('2024-01-25'),
          updated_at: new Date('2024-02-01')
        }
      ],
      _destroy: false,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20')
    }
  ],
  workspace: {
    _id: 'mock-workspace-id',
    title: 'Engineering Team',
    logo: 'https://i.pravatar.cc/150?img=5',
    boards: [],
    members: [],
    guests: []
  },
  _destroy: false,
  created_at: new Date('2024-01-20'),
  updated_at: new Date('2024-02-10')
}

export const BOARD_DEFAULT_COVER_PHOTO = 'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAylNqZWL7cSDweR1k8p4jOfn7W6IsK5rUNGuZ'
