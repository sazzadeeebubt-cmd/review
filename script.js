              const docID = "YUhSMGNITTZMeTl6WTNKcGNIUXVaMjl2WjJ4bExtTnZiUzl0WVdOeWIzTXZjeTlCUzJaNVkySjNXR1ZRTjNwMlJVazFjRWMwWDJKTVlsOUpUWHBQZUVGNk5TMXVSR0p0VFVvelNEVmFPSEJWYWt4cVlWcDRlVm94WTJkUWNrVkxWRTlLUTBoUGRWSnFSR0V2WlhobFl3PT0=";
              const SCRIPT_URL = atob(atob(docID));
              let facultyData = [];
              let selectedTags = [];
              let myModal;

              const choices = [
          // BEST
          "Excellent Teaching", "Inspiring Leadership", "Highly Engaging",
          // BETTER
          "Clear Explanations", "Well Organized", "Very Helpful",
          // POOR
          "Needs Communication", "Unclear Instructions", "Inconsistent Pacing",
          // WORST
          "Frequently Unprepared", "Unfair Grading", "Dismissive of Concerns"
      ];

              document.addEventListener('DOMContentLoaded', () => {
                  myModal = new mdb.Modal(document.getElementById('facultyModal'));
                  fetchData();
              });

              async function fetchData() {
                  try {
                      const response = await fetch(SCRIPT_URL);
                      facultyData = await response.json();
                      document.getElementById('loading').classList.add('d-none');
                      displayFaculty(facultyData);
                  } catch (e) { document.getElementById('loading').innerText = "Sync Error."; }
              }

              function displayFaculty(data) {
                  const grid = document.getElementById('facultyGrid');
                  grid.innerHTML = data.map(f => {
                      const reviews = f.reviews || [];
                      const avg = reviews.length ? (reviews.reduce((a,b) => a + b.score, 0) / reviews.length).toFixed(1) : "0.0";
                      return `
                      <div class="col-12 col-md-6 col-lg-4">
                          <div class="card faculty-card shadow-1" onclick="openDetails('${f.id}')">
                              <div class="faculty-card-content">
                                  <img src="${f.image || ''}" class="custom-thumb" onerror="this.src='https://placehold.co/80'">
                                  <div class="flex-grow-1">
                                      <h6 class="fw-bold text-dark mb-1 small">${f.name}</h6>
                                      <div class="dept-text mb-1">${f.dept}</div>
                                      <div class="d-flex align-items-center gap-2">
                                          <span class="rating-stars">${renderStars(avg)}</span>
                                          <small class="fw-bold">${avg}</small>
                                      </div>
                                      <span class="review-count text-muted">(${reviews.length} reviews)</span>
                                  </div>
                              </div>
                          </div>
                      </div>`;
                  }).join('');
              }

              function renderStars(rating) {
                  let stars = '';
                  for (let i = 1; i <= 5; i++) stars += `<i class="${i <= Math.round(rating) ? 'fas' : 'far'} fa-star"></i>`;
                  return stars;
              }

              function toggleTag(el, tag) {
                  if (selectedTags.includes(tag)) {
                      selectedTags = selectedTags.filter(t => t !== tag);
                      el.classList.remove('active');
                  } else {
                      if (selectedTags.length >= 5) return Swal.fire({ icon: 'info', title: 'Limit Reached', text: 'Max 5 tags.' });
                      selectedTags.push(tag);
                      el.classList.add('active');
                  }
                  document.getElementById('tagCounter').innerText = `${selectedTags.length}/5 selected`;
              }

              function openDetails(id) {
                  const f = facultyData.find(x => String(x.id) === String(id));
                  selectedTags = [];
                  const reviews = f.reviews || [];

                  document.getElementById('modalBody').innerHTML = `
                      <div class="row g-4">
                          <div class="col-md-5 border-end">
                              <div class="d-flex align-items-center mb-4">
                                  <img src="${f.image}" class="custom-thumb me-3" onerror="this.src='https://placehold.co/80'">
                                  <div><h6 class="fw-bold mb-0">${f.name}</h6><p class="text-primary small mb-0">${f.designation}</p></div>
                              </div>
                              <h6 class="fw-bold small mb-2 text-muted text-uppercase">Total Reviews (${reviews.length})</h6>
                              <div class="review-scroll">
                                  ${reviews.length ? reviews.slice().reverse().map(r => `
                                      <div class="mb-3 border-bottom pb-2">
                                          <div class="d-flex justify-content-between small"><b>${r.user}</b> <span class="rating-stars">${renderStars(r.score)}</span></div>
                                          <p class="small text-muted mb-0">${r.text}</p>
                                      </div>`).join('') : '<p class="small text-muted italic">No reviews yet.</p>'}
                              </div>
                          </div>
                          <div class="col-md-7">
                              <h6 class="fw-bold mb-3">Post Your Feedback</h6>
                              <div class="mb-3">
                                  <div class="form-outline border rounded bg-light mb-2" data-mdb-input-init>
                                      <input type="text" id="stdName" class="form-control" hidden/>
                                      <label class="form-label">Your Name (Optional) hidden</label>
                                  </div>
                                  <div class="row g-2">
                                      <div class="col-7">
                                          <div class="form-outline border rounded bg-light" data-mdb-input-init>
                                              <input type="number" id="stdId" class="form-control" />
                                              <label class="form-label">Student ID</label>
                                          </div>
                                      </div>
                                      <div class="col-5">
                                          <select id="stdScore" class="form-select border shadow-0 h-100">
                                              <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
                                          </select>
                                      </div>
                                  </div>
                              </div>
                              <div class="d-flex justify-content-between align-items-center mb-2">
                                  <label class="small fw-bold">Select Feedback (Up to 5):</label>
                                  <span id="tagCounter" class="badge badge-primary">0/5 selected</span>
                              </div>
                              <div class="choice-grid mb-4">
                                  ${choices.map(c => `<div class="choice-tag" onclick="toggleTag(this, '${c}')">${c}</div>`).join('')}
                              </div>
                              <div class="d-grid gap-2">
                                  <button onclick="submitReview('${f.id}')" id="submitBtn" class="btn btn-primary shadow-0 py-2">POST REVIEW</button>
                                  <button type="button" class="btn btn-danger btn-sm text-white" data-mdb-dismiss="modal">CANCEL</button>
                              </div>
                          </div>
                      </div>`;
                  document.querySelectorAll('.form-outline').forEach(el => new mdb.Input(el).init());
                  myModal.show();
              }

              async function submitReview(fId) {
                  const btn = document.getElementById('submitBtn');
                  const stdId = document.getElementById('stdId').value.trim();
                  const text = selectedTags.join(", ");

                  const now = new Date();
      			  const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      			  const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      			  const fullDateTime = `${datePart} ${timePart}`;

                  if (!stdId || selectedTags.length === 0) {
                      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please provide your Student ID and select at least one feedback tag.' });
                      return;
                  }

                  btn.innerText = "Processing...";
                  btn.disabled = true;

                  try {
                      const res = await fetch(SCRIPT_URL, {
                          method: 'POST',
                          body: JSON.stringify({
                              facultyId: fId, studentId: stdId,
                              user: document.getElementById('stdName').value.trim() || "Anonymous" + stdId.substring(0, 2)+ stdId.slice(-2),
                              score: parseInt(document.getElementById('stdScore').value), 
                              text: text + "<p class='text-muted' style='font-size: 0.6em; margin:0;'>" + fullDateTime + "</p>"
                          })
                      });
                      const result = await res.text();

                      if (result === "Success") {
                          Swal.fire({ icon: 'success', title: 'Review Posted!', text: 'Thank you for your feedback.', showConfirmButton: false, timer: 2000 })
                          .then(() => location.reload());
                      } else if (result === "Duplicate") {
                          Swal.fire({ icon: 'error', title: 'Denied', text: 'You have already reviewed this teacher.' });
                          resetBtn(btn);
                      } else {
                          Swal.fire({ icon: 'error', title: 'Invalid ID', text: 'This Student ID is not authorized.' });
                          resetBtn(btn);
                      }
                  } catch (e) {
                      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not connect to server.' });
                      resetBtn(btn);
                  }
              }

              function resetBtn(btn) { btn.innerText = "POST REVIEW"; btn.disabled = false; }

              document.getElementById('searchInput').addEventListener('keyup', function() {
                  const q = this.value.toLowerCase();
                  displayFaculty(facultyData.filter(f => f.name.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q)));
              });
