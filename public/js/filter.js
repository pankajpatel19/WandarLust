let buttontoggle = document.getElementById("flexSwitchCheckDefault");

buttontoggle.addEventListener("click", () => {
  let gst = document.getElementsByClassName("gst");
  for (info of gst) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
