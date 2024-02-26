let currSelection = "";

let ufdata = [];

const northWest = {
    'lat': 49.910046,
    'long': 7.226884
};

const southEast = {
    'lat': 47.275870,
    'long': 10.778297
};

function showData() {
    currSelection = currSelection.trim();

    document.querySelector('.uflist').innerHTML = '';

    for (let entry of ufdata) {
        if (currSelection.length != 0 && !entry.city.includes(currSelection))
            continue;

        let htmlElem = document.createElement("div");
        htmlElem.innerHTML = `
        <div class="mb-6 rounded overflow-hidden shadow-xl">
            <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">${entry.name}</div>
            <p class="text-gray-700 text-base">
                ${entry.description}
            </p>
            </div>
            <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${entry.city}</span>
            </div>
        </div>`;
        document.querySelector('.uflist').appendChild(htmlElem);
    }
}

window.onload = function () {
    const radius = 5;

    const image = document.querySelector('img');
    const pixelsPerLat = image.clientHeight / (northWest.lat - southEast.lat);
    const pixelsPerLong = image.clientWidth / (southEast.long - northWest.long);

    console.log(pixelsPerLong);
    console.log(pixelsPerLat);

    fetch('/output.json')
        .then((response) => response.json())
        .then((data) => {
            ufdata = data;
            showData();

            for (let city of data) {
                if ((city.location.lat > northWest.lat || city.location.lat < southEast.lat) || (city.location.lng < northWest.long || city.location.lng > southEast.long))
                     continue;

                // Insert circle
                let newDot = document.createElement("div");
                newDot.classList.add("circle");
                newDot.style.width = `${2 * radius}px`;
                newDot.style.height = `${2 * radius}px`;

                // Compute relative position within image
                newDot.style.left = ((city.location.lng - northWest.long) * pixelsPerLong) + "px";
                console.log(newDot.style.left);
                newDot.style.top = (-1*(city.location.lat - northWest.lat) * pixelsPerLat) + "px";

                newDot.addEventListener('click', () => {
                    currSelection = city.city;
                    document.querySelector('#search').value = currSelection;
                    showData();
                });

                document.querySelector("#dots").appendChild(newDot);
            }
        });

    document.querySelector('#search').addEventListener("input", (e) => {
        currSelection = e.target.value;
        showData();
    });

    document.querySelector("#clear").addEventListener('click', () => {
        currSelection = '';
        showData();
        document.querySelector('#search').value = currSelection;
    });
}

document.querySelectorAll('#citiesmap area').forEach((areaElem) => {
    areaElem.addEventListener('click', function (e) {
        console.log("Clicked on ")
    });
});
