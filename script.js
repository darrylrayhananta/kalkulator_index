document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    
    // Result Elements
    const resultIp = document.getElementById('result-ip');
    const resultStatus = document.getElementById('result-status');
    const resultTotalSks = document.getElementById('result-total-sks');
    const resultTotalPoints = document.getElementById('result-total-points');
    
    // Cumulative Elements
    const toggleCumulativeBtn = document.getElementById('toggle-cumulative');
    const cumulativeInputs = document.getElementById('cumulative-inputs');
    const prevIpkInput = document.getElementById('prev-ipk');
    const prevSksInput = document.getElementById('prev-sks');
    const resultIpk = document.getElementById('result-ipk');
    const cumulativeIcon = document.getElementById('cumulative-icon');

    const gradeValues = {
        'A': 4.0,
        'AB': 3.5,
        'B': 3.0,
        'BC': 2.5,
        'C': 2.0,
        'D': 1.0,
        'E': 0.0
    };

    // Initialize with 4 empty rows for convenience
    for(let i=0; i<4; i++) {
        addCourseRow();
    }

    // Toggle Cumulative Section
    toggleCumulativeBtn.addEventListener('click', () => {
        toggleCumulativeBtn.classList.toggle('active');
        cumulativeInputs.classList.toggle('show');
    });

    addCourseBtn.addEventListener('click', () => {
        addCourseRow();
    });

    // Listen to changes in optional inputs
    prevIpkInput.addEventListener('input', calculate);
    prevSksInput.addEventListener('input', calculate);

    function addCourseRow() {
        const row = document.createElement('div');
        row.className = 'course-row';
        row.innerHTML = `
            <input type="text" class="input-name" placeholder="Matkul">
            <input type="number" class="input-sks" placeholder="0" min="0">
            <select class="input-grade">
                <option value="" disabled selected>-</option>
                <option value="A">A (4)</option>
                <option value="AB">AB (3.5)</option>
                <option value="B">B (3)</option>
                <option value="BC">BC (2.5)</option>
                <option value="C">C (2)</option>
                <option value="D">D (1)</option>
                <option value="E">E (0)</option>
            </select>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Add event listeners for instant calculation
        const sksInput = row.querySelector('.input-sks');
        const gradeInput = row.querySelector('.input-grade');
        const deleteBtn = row.querySelector('.delete-btn');

        sksInput.addEventListener('input', calculate);
        gradeInput.addEventListener('change', calculate);
        deleteBtn.addEventListener('click', () => {
            // Animate removal
            row.style.opacity = '0';
            row.style.transform = 'translateX(20px)';
            setTimeout(() => {
                row.remove();
                calculate();
            }, 300);
        });

        courseList.appendChild(row);
    }

    function calculate() {
        const rows = document.querySelectorAll('.course-row');
        let totalSks = 0;
        let totalPoints = 0;
        let hasData = false;

        rows.forEach(row => {
            const sks = parseFloat(row.querySelector('.input-sks').value) || 0;
            const grade = row.querySelector('.input-grade').value;
            
            if (sks > 0 && grade && gradeValues.hasOwnProperty(grade)) {
                totalSks += sks;
                totalPoints += sks * gradeValues[grade];
                hasData = true;
            }
        });

        // Semester IP Calculation
        let ip = 0;
        if (totalSks > 0) {
            ip = totalPoints / totalSks;
        }

        updateDisplay(ip, totalSks, totalPoints, hasData);
        calculateCumulative(totalPoints, totalSks);
    }

    function updateDisplay(ip, totalSks, totalPoints, hasData) {
        resultIp.textContent = hasData ? ip.toFixed(2) : '0.00';
        resultTotalSks.textContent = totalSks;
        resultTotalPoints.textContent = totalPoints.toFixed(1);

        // Styling based on IP
        resultIp.style.color = hasData ? getIpColor(ip) : '#f8fafc';
        
        // Update status badge
        if (hasData) {
            resultStatus.className = 'status-pill ' + getStatusClass(ip);
            resultStatus.textContent = getStatusText(ip);
        } else {
            resultStatus.className = 'status-pill status-gray';
            resultStatus.textContent = 'Belum ada data';
        }
    }

    function calculateCumulative(semesterPoints, semesterSks) {
        const prevIpk = parseFloat(prevIpkInput.value);
        const prevSks = parseFloat(prevSksInput.value);

        if (!isNaN(prevIpk) && !isNaN(prevSks) && prevSks >= 0) {
            const prevPoints = prevIpk * prevSks;
            const totalCumulativePoints = prevPoints + semesterPoints;
            const totalCumulativeSks = prevSks + semesterSks;
            
            let ipk = 0;
            if (totalCumulativeSks > 0) {
                ipk = totalCumulativePoints / totalCumulativeSks;
            }
            
            resultIpk.textContent = ipk.toFixed(2);
            resultIpk.style.color = getIpColor(ipk);
        } else {
            resultIpk.textContent = '0.00';
            resultIpk.style.color = 'var(--accent-blue)';
        }
    }

    function getIpColor(ip) {
        if (ip >= 3.5) return 'var(--accent-green)'; // Green
        if (ip >= 2.5) return 'var(--accent-yellow)'; // Yellow
        return 'var(--accent-red)'; // Red
    }

    function getStatusClass(ip) {
        if (ip >= 3.5) return 'status-green';
        if (ip >= 2.0) return 'status-yellow';
        return 'status-red';
    }

    function getStatusText(ip) {
        if (ip >= 3.5) return 'Cum Laude';
        if (ip >= 3.0) return 'Sangat Baik';
        if (ip >= 2.5) return 'Baik';
        if (ip >= 2.0) return 'Cukup';
        return 'Kurang';
    }
});