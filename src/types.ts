/* eslint-disable @typescript-eslint/no-explicit-any */
export type Body = {
  action: Action;
  model: Model;
  webhook: Webhook;
};

export type Action = {
  id: string;
  idMemberCreator: string;
  data: Data;
  appCreator: null;
  type: string;
  date: Date;
  limits: null;
  display: Display;
  memberCreator: MemberCreator;
};

export type Data = {
  card: DataCard;
  old: Old;
  board: Board;
  listBefore: List;
  listAfter: List;
};

export type Board = {
  id: string;
  name: string;
  shortLink: string;
};

export type DataCard = {
  idList: string;
  id: string;
  name: string;
  idShort: number;
  shortLink: string;
};

export type List = {
  id: string;
  name: string;
};

export type Old = {
  idList?: string;
};

export type Display = {
  translationKey: string;
  entities: Entities;
};

export type Entities = {
  card: EntitiesCard;
  listBefore: ListAfter;
  listAfter: ListAfter;
  memberCreator: ListAfter;
};

export type EntitiesCard = {
  type: string;
  idList: string;
  id: string;
  shortLink: string;
  text: string;
};

export type ListAfter = {
  type: string;
  id: string;
  text: string;
  username?: string;
};

export type MemberCreator = {
  id: string;
  activityBlocked: boolean;
  avatarHash: string;
  avatarUrl: string;
  fullName: string;
  idMemberReferrer: null;
  initials: string;
  nonPublic: unknown;
  nonPublicAvailable: boolean;
  username: string;
};

export type Model = {
  id: string;
  name: string;
  desc: string;
  descData: null;
  closed: boolean;
  idOrganization: string;
  idEnterprise: null;
  pinned: boolean;
  url: string;
  shortUrl: string;
  prefs: Prefs;
  labelNames: LabelNames;
};

export type LabelNames = {
  green: string;
  yellow: string;
  orange: string;
  red: string;
  purple: string;
  blue: string;
  sky: string;
  lime: string;
  pink: string;
  black: string;
  green_dark: string;
  yellow_dark: string;
  orange_dark: string;
  red_dark: string;
  purple_dark: string;
  blue_dark: string;
  sky_dark: string;
  lime_dark: string;
  pink_dark: string;
  black_dark: string;
  green_light: string;
  yellow_light: string;
  orange_light: string;
  red_light: string;
  purple_light: string;
  blue_light: string;
  sky_light: string;
  lime_light: string;
  pink_light: string;
  black_light: string;
};

export type Prefs = {
  permissionLevel: string;
  hideVotes: boolean;
  voting: string;
  comments: string;
  invitations: string;
  selfJoin: boolean;
  cardCovers: boolean;
  isTemplate: boolean;
  cardAging: string;
  calendarFeedEnabled: boolean;
  switcherViews: SwitcherView[];
  background: string;
  backgroundColor: null;
  backgroundImage: string;
  backgroundImageScaled: BackgroundImageScaled[];
  backgroundTile: boolean;
  backgroundBrightness: string;
  backgroundBottomColor: string;
  backgroundTopColor: string;
  canBePublic: boolean;
  canBeEnterprise: boolean;
  canBeOrg: boolean;
  canBePrivate: boolean;
  canInvite: boolean;
};

export type BackgroundImageScaled = {
  width: number;
  height: number;
  url: string;
};

export type SwitcherView = {
  viewType: string;
  enabled: boolean;
};

export type Webhook = {
  id: string;
  description: string;
  idModel: string;
  callbackURL: string;
  active: boolean;
  consecutiveFailures: number;
  firstConsecutiveFailDate: null;
};

export interface Card {
  id: string;
  badges: Badges;
  checkItemStates: unknown[];
  closed: boolean;
  dueComplete: boolean;
  dateLastActivity: Date;
  desc: string;
  descData: DescData;
  due: null;
  dueReminder: null;
  email: null;
  idBoard: string;
  idChecklists: string[];
  idList: string;
  idMembers: unknown[];
  idMembersVoted: unknown[];
  idShort: number;
  idAttachmentCover: null;
  labels: unknown[];
  idLabels: unknown[];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: null;
  subscribed: boolean;
  url: string;
  cover: Cover;
  isTemplate: boolean;
  cardRole: null;
}

export interface Badges {
  attachmentsByType: AttachmentsByType;
  location: boolean;
  votes: number;
  viewingMemberVoted: boolean;
  subscribed: boolean;
  fogbugz: string;
  checkItems: number;
  checkItemsChecked: number;
  checkItemsEarliestDue: null;
  comments: number;
  attachments: number;
  description: boolean;
  due: null;
  dueComplete: boolean;
  start: null;
}

export interface AttachmentsByType {
  trello: Trello;
}

export interface Trello {
  board: number;
  card: number;
}

export interface Cover {
  idAttachment: null;
  color: null;
  idUploadedBackground: null;
  size: string;
  brightness: string;
  idPlugin: null;
}

export interface DescData {
  emoji: Emoji;
}

export interface Emoji {}

export interface CustomField {
  id: string;
  value: Value;
  idValue: null;
  idCustomField: string;
  idModel: string;
  modelType: string;
}

export interface Value {
  text: string;
}

export interface Checklist {
  id: string;
  name: string;
  idBoard: string;
  idCard: string;
  pos: number;
  checkItems: any[];
  limits: any;
}

export interface ChecklistItem {
  id: string;
  name: string;
  pos: number;
  state: string;
  idChecklist: string;
}
