export const PASSWORD_HASH_SALT_ROUNDS = 10

export const HIDDEN_STOCKIN_MESSAGE = '===== Re-Stockin ====='

export const PROCESS_ENV = 5000

export enum UserStatus {
  NEW,
  ACTIVE,
  LOCK,
}

export enum SALE_TYPE {
  NUMBER = 1,
  PERCENT = 2,
}

export enum ORDER_STATUS {
  NEW = 0,
  PROCESSING = 1,
  DELIVERING = 2,
  DONE = 3,
  REJECT = 4,
}

export enum ACCOUNT_STATUS {
  ACTIVE = 1,
  DEACTIVE = 2,
}

export enum STOCKOUT_STATUS {
  INCOMPLETE = 0,
  COMPLETED = 1,
}

export enum UserRole {
  AUTHORED_USER = 'AUTHORED_USER',
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
}

export enum UserType {
  INDIVIDUAL,
  BUSINESS,
}

export enum Gender {
  MALE,
  FEMALE,
}

export enum AISolutionStatus {
  DRAFT,
  PUBLISH,
  LOCK,
}

export enum AIProviderType {
  COMPANY,
  INSTITUE,
}

export enum MediaSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export enum QUEUE_NAME {
  SEND_MAIL = 'send-mail',
  RESOURCE = 'resource',
}

export enum RESOURCE_JOB_NAME {
  SOLUTION = 'solution',
  ACCOUNT = 'account',
  SOLUTION_SCREENSHOT = 'solution_screenshot',
}

export const ROLES_ALLOW_SELF_SIGNUP = [
  UserRole.AUTHORED_USER,
  UserRole.CUSTOMER,
  UserRole.PROVIDER,
]

export enum EMPLOYEE_SIZE {
  MICROENTREPRISES = 'microentreprises', // 1 to 9 employees.
  SMALL_ENTERPRISES = 'small_enterprises', // 10 to 49 employees.
  MEDIUM_SIZED_ENTERPRISES = 'medium_sized_enterprises', //50 to 249 employees.
  LARGE_ENTERPRISES = 'large_enterprises', // 250 employees or more.
}

export enum CHANGE_PASSWORD_TYPE {
  RESET_PASSWORD,
  UPDATE_CURRENT_PASSWORD,
}

export enum CATEGORIES_POST {
  NEWS = 'news',
  GUIDES = 'guides',
  EVENTS = 'events',
  COURSES = 'courses',
}

export const uploadFilesDir = 'upload'

export enum DurationUnit {
  WEEK = 'week',
  MONTH = 'year',
  YEAR = 'year',
}

export enum SOCIAL_TYPE {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
}

export enum RequestSolutionStatus {
  NEW,
  ON_PROCESS,
  COMPLETED,
  CANCELED,
}

export const LIMIT_SOCIAL_LINK = 10

export enum SOLUTION_RELATED_BY {
  ALL = 'all',
  INDUSTRY = 'industry',
  PROVIDER = 'provider',
  TECHNOLOGY = 'technology',
}

export const STATUS_PACKAGE = {
  0: 'pending',
  1: 'completed',
  2: 'rejected',
}

export enum PACKAGE {
  PREMIUM = 'PREMIUM',
  ADVANCE = 'ADVANCE',
  STANDARD = 'STANDARD',
  BASIC = 'BASIC',
}
