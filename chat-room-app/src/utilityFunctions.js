export default class UtilityFunctions {
  static getCurrentDate() {
    return new Date(Date.now()).toLocaleDateString();
  }

  static getCurrentTime() {
    return new Date(Date.now()).toLocaleTimeString();
  }
}
