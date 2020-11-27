const helpers = {
  capitalize: function(s) {
    if (typeof s !== "string") return "";
    return s
      .toLowerCase()
      .split(" ")
      .map(name => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  }
};

export default helpers;
