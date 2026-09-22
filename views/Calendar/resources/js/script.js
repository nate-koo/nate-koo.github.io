let eventState = 'add';
let cal_event_id = -1;
let event_elm = null;

//initial call to intialize form correctly
updateLocationOptions()

function updateLocationOptions() {
    const value = document.getElementById('event_modality').value;
    console.log(value)
    const inPersonContainer = document.getElementById('inPerson_event_container');
    const remoteContainer =  document.getElementById('remote_event_container');

    const inPersonForm = document.getElementById('event_location');
    const remote_Form = document.getElementById('event_remote_url');
    if(value == 'in-person'){
        inPersonContainer.style.display = 'block'
        inPersonForm.disabled = false

        remoteContainer.style.display = 'none'
        remote_Form.disabled = true
    } else if (value == 'remote') {
        inPersonContainer.style.display = 'none'
        inPersonForm.disabled = true


        remoteContainer.style.display = 'block'
        remote_Form.disabled = false
    }
}

const events = [];

function saveEvent(){
    if(!validateForm()){
        return;
    }

    const name = document.getElementById('event_name').value;
    const time = document.getElementById('event_time').value;
    const weekDay = document.getElementById('event_weekday').value;
    const modality = document.getElementById('event_modality').value;
    let location = null;
    let remote_url = null;
    
    if(modality == 'in-person'){
        location = document.getElementById('event_location').value;
    } else {
        remote_url = document.getElementById('event_remote_url').value;
    }

    const attendees = document.getElementById('event_attendees').value;

    const category = document.getElementById('catagory').value;
    
    //TODO change differently depending on whether adding or editing events.
    if(eventState == 'add'){
        const event = {
            name: name,
            weekday: weekDay,
            time: time,
            modality:  modality,
            location:location,
            remote_url: remote_url,
            attendees: attendees,
            category: category,
        }

        console.log(event)

        events.push(event);

        const modalElement = document.getElementById('event_modal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();

        const form = document.getElementById('event_form');
        form.reset();
        form.classList.remove('was-validated');

        updateLocationOptions();

        addEventToCalendarUI(event);
    } else if (eventState == 'edit') {
        event_elm.remove();

        //Remove event, but don't change array index of other events
        events[cal_event_id] = null;

        const event = {
            name: name,
            weekday: weekDay,
            time: time,
            modality:  modality,
            location:location,
            remote_url: remote_url,
            attendees: attendees,
            category: category,
        }

        console.log(event)

        events.push(event);

        const modalElement = document.getElementById('event_modal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();

        const form = document.getElementById('event_form');
        form.reset();
        form.classList.remove('was-validated');

        updateLocationOptions();

        addEventToCalendarUI(event);
    } else {
        throw "Uknown event state: " + eventState;
    }
}


function validateForm(){
    var success = true;
    
    // Loop over them and prevent submission
    const form = document.getElementById('event_form');

    if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        success = false;
    }

    form.classList.add('was-validated')

    return success;
}

function createEventCard(eventDetails) {
    const eventElement = document.createElement("div");
    eventElement.className = 'event row border rounded m-1 py-1';

    if(eventDetails.category == "School"){
        eventElement.style.backgroundColor = '#ed5f55';
    } else if(eventDetails.category == "Work") {
        eventElement.style.backgroundColor = '#82c5f5';
    } else {
        eventElement.style.backgroundColor = '#3cfa7b';
    }

    const nameElm = document.createElement("div");
    nameElm.innerText = eventDetails.name;
    eventElement.appendChild(nameElm);

    const timeElm = document.createElement("div");
    timeElm.innerText = eventDetails.time;
    eventElement.appendChild(timeElm);

    const modalityElm = document.createElement("div");
    modalityElm.innerText = eventDetails.modality;
    eventElement.appendChild(modalityElm);

    if(eventDetails.modality == "in-person"){
        const locationElm = document.createElement("div");
        locationElm.innerText = eventDetails.location;
        eventElement.appendChild(locationElm);
    } else {
        const remoteURLElm = document.createElement("div");
        remoteURLElm.innerText = eventDetails.remote_url;
        eventElement.appendChild(remoteURLElm);
    }

    const attendeesElm = document.createElement("div");
    attendeesElm.innerText = eventDetails.attendees;
    eventElement.appendChild(attendeesElm);

    const catagoryElm = document.createElement("div");
    attendeesElm.innerText = eventDetails.category;
    eventElement.appendChild(catagoryElm);

    return eventElement;
}

function addEventToCalendarUI(eventInfo) {
    const dayElm = document.getElementById(eventInfo.weekday.toLowerCase());
    const card = createEventCard(eventInfo);

    //Store array position in dom
    card.setAttribute("cal_data_num", events.length - 1);

    card.onclick = (e) => {
        eventState = 'edit';

        const modalElement = document.getElementById('event_modal');

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        cal_event_id = e.currentTarget.getAttribute("cal_data_num");
        event_elm = e.currentTarget;

        const event = events[cal_event_id];

        document.getElementById('event_name').value = event.name
        document.getElementById('event_weekday').value = event.weekday
        document.getElementById('event_time').value = event.time
        document.getElementById('event_modality').value = event.modality
        document.getElementById('event_location').value = event.location
        document.getElementById('event_remote_url').value = event.remote_url
        document.getElementById('event_attendees').value = event.attendees
        document.getElementById('catagory').value = event.category
    }

    dayElm.appendChild(card);
}


const modal = document.getElementById('event_modal');

//On modal close reset editing state
modal.addEventListener('hidden.bs.modal', event => {
    //Prevent a warning about focused element being removed
    if (document.activeElement) {
        document.activeElement.blur();
    }

    //Reset form on close
    const form = document.getElementById('event_form');
    form.reset();
    form.classList.remove('was-validated');

    eventState = 'add';
    cal_event_id = -1;
    event_elm = null;
});

