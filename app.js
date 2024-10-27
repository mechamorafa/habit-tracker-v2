document.addEventListener('DOMContentLoaded', () => {
    const habitTable = document.getElementById('habit-table').getElementsByTagName('tbody')[0];
    const newHabitInput = document.getElementById('new-habit');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const completionPercentage = document.getElementById('completion-percentage');
    
    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Add habit
    addHabitBtn.addEventListener('click', () => {
        const habitName = newHabitInput.value.trim();
        if (habitName) {
            const newHabit = {
                name: habitName,
                days: [false, false, false, false, false, false, false] // Mon-Sun
            };
            habits.push(newHabit);
            saveHabits();
            renderTable();
            newHabitInput.value = '';
        }
    });

    // Save habits to localStorage
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    // Render table
    function renderTable() {
        habitTable.innerHTML = '';
        habits.forEach((habit, habitIndex) => {
            const row = document.createElement('tr');
            
            // Habit name
            const habitCell = document.createElement('td');
            habitCell.textContent = habit.name;
            row.appendChild(habitCell);

            // Habit days (checkboxes)
            habit.days.forEach((done, dayIndex) => {
                const dayCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = done;
                checkbox.addEventListener('change', () => {
                    habits[habitIndex].days[dayIndex] = checkbox.checked;
                    saveHabits();
                    updateCompletionPercentage();
                });
                dayCell.appendChild(checkbox);
                row.appendChild(dayCell);
            });

            // Delete button
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                habits.splice(habitIndex, 1);
                saveHabits();
                renderTable();
                updateCompletionPercentage();
            });
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);

            habitTable.appendChild(row);
        });
        updateCompletionPercentage();
    }

    // Calculate completion percentage
    function updateCompletionPercentage() {
        const totalChecks = habits.reduce((acc, habit) => acc + habit.days.filter(done => done).length, 0);
        const totalPossibleChecks = habits.length * 7;
        const percentage = totalPossibleChecks > 0 ? (totalChecks / totalPossibleChecks) * 100 : 0;
        completionPercentage.textContent = `Completion: ${percentage.toFixed(1)}%`;
    }

    // Initial render
    renderTable();
});
