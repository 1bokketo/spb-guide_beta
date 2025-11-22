let map;
let markers = [];
let routeLine = null;

document.getElementById("enter-app").addEventListener("click", () => {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
});

fetch("routes.json")
    .then((res) => res.json())
    .then((routes) => {
        renderRoutes(routes);
        initMap(routes[0]);
    });

function renderRoutes(routes) {
    const container = document.getElementById("routes");
    container.innerHTML = "";
    routes.forEach((r) => {
        const div = document.createElement("div");
        div.className = "route-card";
        div.innerHTML = `<h3>${r.title}</h3><p>${r.description}</p>`;
        div.onclick = () => showRoute(r);
        container.appendChild(div);
    });
}

function initMap(route) {
    ymaps.ready(() => {
        map = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ["zoomControl"],
        });
        showRoute(route);
    });
}

function showRoute(route) {
    const info = document.getElementById("route-info");
    document.getElementById("route-title").textContent = route.title;
    document.getElementById("route-description").textContent = route.description;

    const ul = document.getElementById("route-points");
    ul.innerHTML = "";

    markers.forEach((m) => map.geoObjects.remove(m));
    markers = [];

    if (routeLine) {
        map.geoObjects.remove(routeLine);
        routeLine = null;
    }

    route.points.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point.name;
        ul.appendChild(li);

        const placemark = new ymaps.Placemark([point.lat, point.lng], {
            balloonContent: point.name,
        });

        map.geoObjects.add(placemark);
        markers.push(placemark);
    });

    const pathCoords = route.points.map(p => [p.lat, p.lng]);
    routeLine = new ymaps.Polyline(
        pathCoords,
        {},
        {
            strokeColor: "#ff6600",
            strokeWidth: 4,
            strokeOpacity: 0.9
        }
    );
    map.geoObjects.add(routeLine);

    if (markers.length > 0) {
        const bounds = ymaps.geoQuery(markers).getBounds();
        map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 30 });
    }

    info.classList.remove("hidden");
}