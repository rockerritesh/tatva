import"./styles-DgDpocLj.js";function a(){const e=localStorage.getItem("theme")||"light";document.documentElement.setAttribute("data-theme",e);const t=document.getElementById("theme-toggle");t&&t.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",o),localStorage.setItem("theme",o)})}async function r(){const e=document.getElementById("posts-container");try{const t=await fetch("./posts-index.json");if(!t.ok)throw new Error("Failed to load posts");const o=await t.json();if(o.length===0){e.innerHTML='<p class="no-posts">No posts available yet.</p>';return}const s=o.map(n=>`
            <article class="post-card">
                <h4><a href="./posts/${n.filename}">${n.title}</a></h4>
                <p class="post-date">${n.date}</p>
                <p class="post-excerpt">${n.excerpt}</p>
            </article>
        `).join("");e.innerHTML=s}catch(t){console.error("Error loading posts:",t),e.innerHTML='<p class="error">Failed to load posts.</p>'}}document.addEventListener("DOMContentLoaded",()=>{a(),r()});
