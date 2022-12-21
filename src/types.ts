export type Email = {
  id: string;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  archived: boolean;
  read: boolean;
};

export type KeyCombination = {
  key: string;
  fn: Function;
};

export type Screen = "inbox" | "archived";

export type emailActions = {
  toggleRead: boolean;
  toggleArchive: boolean;
  save: boolean;
  closeModal: boolean;
  goNewer: boolean;
  goOlder: boolean;
};
