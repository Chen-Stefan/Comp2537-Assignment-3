function loadAllTimelines() {
  $.ajax({
    type: "GET",
    url: "http://localhost:5000/timeline/getAllEvents",
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
        type: "DELETE",
        url: `http://localhost:5000/timeline/delete/${eventID}`,
        success: (res) => {console.log(res)}
    })
}

function clearAllTimelineEvents() {
    $("#container").empty();
    $.ajax({
        type: "DELETE",
        url: `http://localhost:5000/timeline/deleteAllEvents`,
        success: (res) => {console.log(res)}
    })  
}


function setup() {
  loadAllTimelines();
  $("body").on("click", ".hide", deleteSingleTimelineEvent);
  $("body").on("click", "#clear-btn", clearAllTimelineEvents);
}

$(document).ready(setup);
