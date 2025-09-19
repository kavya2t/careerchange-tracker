//import React, {useEffect, useState, useMemo} from 'react'
//const [view, setView] = useState('dashboard')
//const [selectedWeek, setSelectedWeek] = useState(1)
//const [plan, setPlan] = useState(()=>state.data.plan || generate12WeekPlan())
//const [tasks, setTasks] = useState(()=>state.data.tasks || [])
//const [reminders, setReminders] = useState(()=>state.data.reminders || [])
//const [newTask, setNewTask] = useState('')
//const [exportText, setExportText] = useState('')
import React, {useEffect, useState, useMemo} from 'react'
import { v4 as uuidv4 } from 'uuid'


// Helper: simple localStorage-based user management (mock only)
const STORAGE_KEY = 'careerchange:v1'


function loadState(){
  try{const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : {users:[], sessions:{}, data:{}} }catch(e){return {users:[], sessions:{}, data:{}}}
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }


// Initial 12-week template generator (shortened for demo — you can expand)
function generate12WeekPlan(){
  const weeks = []
  const topicsByWeek = [
    ['Number System','LCM & HCF','Percentages','Simple Interest'],
    ['Time & Work','Speed & Distance','Ratio & Proportion','Averages'],
    ['Algebra Basics','Quadratic Equations','Mensuration Basics','Geometry'],
    ['Probability & Permutations','Data Interpretation','Work on Accuracy','Mock & Review'],
    ['Reasoning Series','Seating Arrangements','Coding-Decoding','Puzzles'],
    ['Telangana History','Polity Basics','Current Affairs','Map Practice'],
    ['English Grammar','Comprehension','Essay Writing','Letter Writing'],
    ['Mock Tests','Error Bank','Revision of Math','Revision of Reasoning'],
    ['Advanced Algebra','Trigonometry basics','Graph Interpretation','Speed Tactics'],
    ['Telugu Grammar','Telugu Essay Practice','Precision Writing','Telugu Comprehension'],
    ['Final Mocks','Descriptive Practice','Interview Prep','Document Checklist'],
    ['Light Revision','PET Prep Planning','Mental Conditioning','Final Touches']
  ]
  for(let i=0;i<12;i++){
    const days = []
    for(let d=0;d<7;d++){
      const topic = topicsByWeek[i][d%topicsByWeek[i].length]
      days.push({id:uuidv4(), title:`Week ${i+1} - Day ${d+1}: ${topic}`, done:false, notes:''})
    }
    weeks.push({week:i+1, days})
  }
  return weeks
}


export default function App(){
const [state, setState] = useState(()=>loadState())
const [user, setUser] = useState(()=>{ const s=localStorage.getItem('careerchange:session'); return s?JSON.parse(s):null })
const [view, setView] = useState('dashboard')
const [selectedWeek, setSelectedWeek] = useState(1)
const [plan, setPlan] = useState(()=>state.data.plan || generate12WeekPlan())
const [tasks, setTasks] = useState(()=>state.data.tasks || [])
const [reminders, setReminders] = useState(()=>state.data.reminders || [])
const [newTask, setNewTask] = useState('')
const [exportText, setExportText] = useState('')

// Persist on changes
useEffect(()=>{ const s=loadState(); s.data = {plan,tasks,reminders}; saveState(s) }, [plan,tasks,reminders])


// Notifications permission
useEffect(()=>{
  if('Notification' in window && Notification.permission!=='granted')
  {
    // ask later when user triggers
  }
},[])


// Simple auth functions
function signup({name,email,password}){
  const s = loadState()
  if(s.users.some(u=>u.email===email)) throw new Error('User exists')
  const userObj = {id:uuidv4(), name, email, password}
  s.users.push(userObj); saveState(s)
  localStorage.setItem('careerchange:session', JSON.stringify(userObj)); setUser(userObj); setView('dashboard')
}
function login({email,password}){
  const s = loadState(); const u = s.users.find(x=>x.email===email && x.password===password)
  if(!u) throw new Error('Invalid credentials')
  localStorage.setItem('careerchange:session', JSON.stringify(u)); setUser(u); setView('dashboard')
}
function logout(){ localStorage.removeItem('careerchange:session'); setUser(null); setView('login') }


// Task operations
function addTask(title){ if(!title) return; const t={id:uuidv4(),title,done:false,createdAt:Date.now()}; setTasks(prev=>[t,...prev]); setNewTask('') }
function toggleTask(id){ setTasks(prev=>prev.map(t=> t.id===id?{...t,done:!t.done}:t)) }
function removeTask(id){ setTasks(prev=>prev.filter(t=>t.id!==id)) }


// Plan day toggle
function togglePlanDay(week, dayId){ setPlan(prev=>prev.map(w=> w.week===week?{...w, days:w.days.map(d=> d.id===dayId?{...d,done:!d.done}:d)}:w)) }
function updatePlanNote(week, dayId, notes){ setPlan(prev=>prev.map(w=> w.week===week?{...w, days:w.days.map(d=> d.id===dayId?{...d,notes}:d)}:w)) }


// Reminders
function scheduleReminder(rem){ // rem: {id,title,timeISO,repeat}
  setReminders(prev=>[...prev,rem])
  scheduleBrowserNotification(rem)
}
function removeReminder(id){ setReminders(prev=>prev.filter(r=>r.id!==id)) }


function scheduleBrowserNotification(rem){
  if(!('Notification' in window)) return
  if(Notification.permission !== 'granted'){ Notification.requestPermission().then(p=>{ if(p==='granted') scheduleBrowserNotification(rem) }) ; return }
  const when = new Date(rem.time).getTime() - Date.now()
  if(when<=0) return
  setTimeout(()=>{
    new Notification(rem.title || 'Reminder', {body:rem.note||'Time for your task'})
    // reschedule if repeat daily
    if(rem.repeat==='daily'){
      const next = new Date(rem.time); next.setDate(next.getDate()+1)
      scheduleReminder({...rem, id:uuidv4(), time: next.toISOString()})
    }
  }, when)
}


// Export / Import
function exportProgress(){ const payload = {plan, tasks, reminders, exportedAt:Date.now()}; setExportText(JSON.stringify(payload, null, 2)) }
function importProgress(text){ try{ const p = JSON.parse(text); if(p.plan) setPlan(p.plan); if(p.tasks) setTasks(p.tasks); if(p.reminders) setReminders(p.reminders); alert('Imported') }catch(e){ alert('Invalid JSON') } }


// Init schedule reminders for stored reminders on mount
useEffect(()=>{ reminders.forEach(r=> scheduleBrowserNotification(r)) },[])


// Derived stats
const totalDays = plan.reduce((s,w)=>s+w.days.length,0)
const doneDays = plan.reduce((s,w)=> s + w.days.filter(d=>d.done).length,0)
const progressPct = Math.round((doneDays/totalDays)*100)


// if no session, show login/signup
if(!user && view!=='signup'){
  return <AuthScreen onLogin={login} onSignup={()=>setView('signup')} />
}
if(!user && view==='signup')
  {
    return <AuthScreenSignup onSignup={(data)=>{ try{ signup(data) }catch(e){ alert(e.message) } }} onBack={()=>setView('login')} />
}
return (
<div className="container">
  <div className="header">
    <div className="logo">CareerChange Tracker</div>
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <div className="small">{user.name} • {user.email}</div>
      <button className="btn" onClick={logout}>Logout</button>
    </div>
  </div>


  <div className="grid">
    <div>
      <div className="card">
        <div className="top-row">
          <div>
            <h3 className="section-title">12-Week Schedule</h3>
            <div className="small">Progress: {doneDays}/{totalDays} days completed</div>
            <div className="progress" style={{marginTop:8}}><i style={{width:`${progressPct}%`}}></i></div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="small">Selected Week</div>
            <select value={selectedWeek} onChange={e=>setSelectedWeek(Number(e.target.value))} className="input" style={{width:120}}>
              {plan.map(w=> <option key={w.week} value={w.week}>Week {w.week}</option>)}
            </select>
          </div>
        </div>




        <div style={{marginTop:12}}>
          {plan.find(w=>w.week===selectedWeek).days.map(d=> (
            <div key={d.id} className="task">
              <div className="left">
                <div style={{cursor:'pointer'}} onClick={()=>togglePlanDay(selectedWeek,d.id)} className="checkbox" aria-hidden />
                <div>
                  <div style={{fontWeight:600}}>{d.title}</div>
                  <div className="small">{d.notes?d.notes.slice(0,120):'No notes'}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button className="small" onClick={()=>{
                  const note = prompt('Add / Edit notes for this day', d.notes||'')
                  if(note!==null) updatePlanNote(selectedWeek,d.id,note)
                }}>Notes</button>
                <button className="btn" onClick={()=>togglePlanDay(selectedWeek,d.id)}>{d.done? 'Undo':'Done'}</button>
              </div>
            </div>
          ))}
        </div>


      </div>


      <div className="card" style={{marginTop:12}}>
        <h3 className="section-title">Add Quick Task</h3>
        <div style={{display:'flex',gap:8}}>
          <input className="input" placeholder="New task e.g. Math practice - 30 Q" value={newTask} onChange={e=>setNewTask(e.target.value)} />
          <button className="btn" onClick={()=>addTask(newTask)}>Add</button>
        </div>


        <div style={{marginTop:12}}>
          {tasks.map(t=> (
            <div key={t.id} className="task">
              <div className="left">
                <div onClick={()=>toggleTask(t.id)} className="checkbox" style={{background: t.done? 'linear-gradient(90deg,var(--accent),var(--success))':''}}></div>
                <div>
                  <div style={{fontWeight:600}}>{t.title}</div>
                  <div className="small">{t.done? 'Done': 'Pending'}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="small" onClick={()=>removeTask(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3 className="section-title">Export / Import Progress</h3>
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button className="btn" onClick={exportProgress}>Prepare Export JSON</button>
          <button className="small" onClick={()=>{ navigator.clipboard.writeText(JSON.stringify({plan,tasks,reminders})); alert('Copied to clipboard') }}>Copy Current</button>
        </div>
        <textarea className="input" value={exportText} onChange={e=>setExportText(e.target.value)} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="btn" onClick={()=>importProgress(exportText)}>Import From Above JSON</button>
        </div>
      </div>


    </div>


    <div>
      <div className="card">
        <h3 className="section-title">Today / Quick Reminders</h3>
        <div className="small">Set browser reminders for study, workout, mock tests.</div>


        <ReminderForm onSchedule={(r)=> scheduleReminder({...r,id:uuidv4()})} />
        <div style={{marginTop:12}}>
          {reminders.map(r=> (
            <div key={r.id} className="task">
              <div>
                <div style={{fontWeight:600}}>{r.title}</div>
                <div className="small">{new Date(r.time).toLocaleString()} • {r.repeat || 'once'}</div>
              </div>
              <div>
                <button className="small" onClick={()=>removeReminder(r.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>


        <div style={{marginTop:12}}>
          <h4 className="section-title">Weekly Targets</h4>
          <div className="weekday">
            <button onClick={()=>alert('Weekly plan: Follow the 12-week schedule. Use daily tasks to mark progress')}>View Plan</button>
            <button onClick={()=>{ const todo = plan.flatMap(w=>w.days).filter(d=>d.done).map(d=>d.title).join('\n'); navigator.clipboard.writeText(todo); alert('Copied finished topics') }}>Copy Finished Topics</button>
          </div>
        </div>


        <div style={{marginTop:12}}>
          <h4 className="section-title">Progress Snapshot</h4>
          <div className="small">Completed days: {doneDays} ({progressPct}%)</div>
        </div>
      </div>


      <div className="card" style={{marginTop:12}}>
            <h3 className="section-title">Language Help / Quick Drills</h3>
            <div className="small">Use this area to paste your Telugu/English writing and get corrections (manual for now).</div>
            <textarea className="input" placeholder="Paste your essay here to keep record" onBlur={(e)=>{ const v=e.target.value; if(!v) return; const item={id:uuidv4(),text:v,createdAt:Date.now()}; const s=loadState(); s.data.samples = s.data.samples || []; s.data.samples.unshift(item); saveState(s); alert('Saved sample — I (coach) will correct here when you paste') }}></textarea>
            <div className="small" style={{marginTop:8}}>Tip: Keep error log in a note and rewrite corrected sentence 3x.</div>


          </div>


        </div>
      </div>


      <div className="footer">Built for your SI/PC preparation. Export progress to GitHub or keep private. Note: this app uses localStorage only — signup/login is mock and not secure for sensitive data.</div>
    </div>
  )
}


// ----------------- Auth components -----------------
function AuthScreen({onLogin, onSignup}){
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [name,setName] = useState('')
return (
<div className="container">
<div className="login-box card">
<h2>Welcome — CareerChange Tracker</h2>
<div className="small">Please login to continue (mock local auth).</div>
<div style={{marginTop:12}}>
<input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="input" placeholder="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} style={{marginTop:8}} />
<div style={{display:'flex',gap:8,marginTop:8}}>
<button className="btn" onClick={()=>{ try{ onLogin({email,password}) }catch(e){ alert(e.message) } }}>Login</button>
<button className="small" onClick={onSignup}>Sign up</button>
</div>
</div>
<div style={{marginTop:12}} className="small">Tip: Use the Sign up link to create a new local account.</div>
</div>
</div>
)
}
function AuthScreenSignup({onSignup, onBack}){
const [name,setName] = useState('')
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
return (
<div className="container">
<div className="login-box card">
<h2>Create Account</h2>
<input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
<input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginTop:8}} />
<input className="input" placeholder="Password" value={password} type="password" onChange={e=>setPassword(e.target.value)} style={{marginTop:8}} />
<div style={{display:'flex',gap:8,marginTop:8}}>
<button className="btn" onClick={()=>{ if(!name||!email||!password){alert('Fill all');return} onSignup({name,email,password}) }}>Sign up</button>
<button className="small" onClick={onBack}>Back</button>
</div>
</div>
</div>
)
}

// ----------------- Reminder Form Component -----------------
function ReminderForm({onSchedule}){
const [title,setTitle] = useState('Study: Maths')
const [note,setNote] = useState('Do 30 practice questions')
const [time,setTime] = useState(()=>{ const d = new Date(); d.setMinutes(d.getMinutes()+5); return d.toISOString().slice(0,16) })
const [repeat,setRepeat] = useState('once')
return (
<div style={{display:'grid',gap:8}}>
<input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
<input className="input" type="datetime-local" value={time} onChange={e=>setTime(e.target.value)} />
<input className="input" placeholder="Short note" value={note} onChange={e=>setNote(e.target.value)} />
<div style={{display:'flex',gap:8}}>
<select className="input" value={repeat} onChange={e=>setRepeat(e.target.value)} style={{width:140}}>
<option value="once">Once</option>
<option value="daily">Daily</option>
</select>
<button className="btn" onClick={()=> onSchedule({title,note,time:new Date(time).toISOString(),repeat}) }>Schedule</button>
</div>
</div>
)
}