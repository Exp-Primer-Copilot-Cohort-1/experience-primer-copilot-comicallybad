function skillsMember() {
    var skill = document.getElementById("skill").value;
    var level = document.getElementById("level").value;
    var table = document.getElementById("skillTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = skill;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = level;
}