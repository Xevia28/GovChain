
document.addEventListener("DOMContentLoaded", () => {
  var accords = document.querySelectorAll(".accordItem");
  console.log(accords)
  accords.forEach(accord => {
    accord.addEventListener('click', (e) => {
      console.log(e)
      var content = accord.querySelector('.accordContent');
      if (content.classList.contains("hideItem")) {
        content.classList.remove("hideItem");
      } else {
        content.classList.add("hideItem");
      }
    })
  })


  const labels = document.querySelectorAll(".labelWrapper p");
  const accordWrappers = document.querySelectorAll(".accordWrapper");

  labels.forEach(label => {
    label.addEventListener('click', () => {
      // Remove active class from all labels and add to the clicked one
      labels.forEach(l => l.classList.remove("active"));
      label.classList.add("active");

      // Get the year from the clicked label
      const year = label.getAttribute("name");

      // Hide all accordWrappers and show the one that matches the year
      accordWrappers.forEach(wrapper => {
        if (wrapper.getAttribute("data-year") === year) {
          wrapper.classList.remove("hide");
        } else {
          wrapper.classList.add("hide");
        }
      });
    });
  });

  const active = document.querySelector('.labelWrapper .active')
  const initYear = active.getAttribute('name')
  accordWrappers.forEach(wrapper => {
    if (wrapper.getAttribute("data-year") === initYear) {
      wrapper.classList.remove("hide");
    } else {
      wrapper.classList.add("hide");
    }
  });
})


//   To link from the database, note then name values for each of the label along with its corresponding AccordWrapper content
// Same name needs to be given to both the label and accord, mainly the year in the data-year attribute for the accordWrapper class