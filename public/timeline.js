function loadAllTimelines() {
  // it's not a type POST, so in the ajax object do not need a "Data" property
  $.ajax({
    type: "GET",
    url: "https://frozen-plains-44646.herokuapp.com/timeline/getAllEvents",
    success: (res) => {
      for (i = 0; i < res.length; i++) {
        let singleEvent = ` <div><p> ${res[i].text} </p>
                <p> Time - ${res[i].time} </p>
                <p> Hits - ${res[i].hits} </p> 
                <input id= ${res[i]._id} class="hide" type="button" value="Remove">
                <hr><div>`;
        if (res[i].text.includes("type")) {
          $("#filter-type").append(`${singleEvent}`);
        } else if (res[i].text.includes("region")) {
          $("#filter-region").append(`${singleEvent}`);
        } else {
          $("#search-name").append(`${singleEvent}`);
        }
      }
    },
  });
}

function deleteSingleTimelineEvent() {
    $(this).parent().remove();
    let eventID = this.id
    $.ajax({
        type: "GET",
        url: `https://frozen-plains-44646.herokuapp.com/timeline/delete/${eventID}`,
        success: (res) => {console.log(res)}
    })
}

function clearAllTimelineEvents() {
    $("#container").empty();
    $.ajax({
        type: "GET",
        url: `https://frozen-plains-44646.herokuapp.com/timeline/deleteAllEvents`,
        success: (res) => {console.log(res)}
    })  
}

function setup() {
  loadAllTimelines();
  $("body").on("click", ".hide", deleteSingleTimelineEvent);
  $("body").on("click", "#clear-btn", clearAllTimelineEvents);
}

$(document).ready(setup);
