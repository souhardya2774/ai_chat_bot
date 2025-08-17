import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($chat_id: uuid!) {
    chats_by_pk(id: $chat_id) {
      id
      title
      created_at
    }
  }
`;

export const GET_MESSAGES_FOR_CHAT = gql`
  query GetMessagesForChat($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`;

export const UPDATE_CHAT_TITLE = gql`
    mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
        update_chats_by_pk(pk_columns: {id: $chatId}, _set: {title: $title}) {
            id
            title
        }
    }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($arg1: SampleInput!) {
    sendMessage(arg1: $arg1) {
      success
      error
      message
    }
  }
`;

export const MESSAGES_SUBSCRIPTION = gql`
  subscription OnNewMessage($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
    }
  }
`;

export const CHATS_SUBSCRIPTION = gql`
  subscription OnChatsUpdate {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;
