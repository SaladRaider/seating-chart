
function initSort(students) {
	self.postMessage({students: students});
}

self.onmessage = function(e) {
	switch(e.data.cmd) {
		case "INIT_SORT": {
			initSort(e.data.students);
			break;
		}
	}
}