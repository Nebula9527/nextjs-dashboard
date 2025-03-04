/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  /**
   * @description：未认证
   */
  UNCERTIFIED = 401,
  /**
   * @description：未授权
   */
  UNAUTHORIZED = 403,
  UNKNOWN = 500,
  OVERDUE = 599,
  TIMEOUT = 10000,
}

/**
 * @description：请求方法
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * @description：常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // text
  TEXT = "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data 上传
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
