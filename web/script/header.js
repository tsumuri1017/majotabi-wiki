 var header = document.getElementById("header");
header.innerHTML = `
<div id="navigation">
      <div class="nav-inner">
        <ul>
          <li class="logo"></li>
          <li class="link create">
            <a href="/">
              <span>トップページ</span>
            </a>
          </li>
          <li class="link">
            <a href="/about/">
              <span>魔女の旅々Wikiついて</span>
            </a>
          </li>
          <li class="link">
            <a href="/terms">
              <span>法的情報</span>
            </a>
          </li>
          <li class="link">
            <a href="/args"><span>args</span></a>
          </li>
          <li class="link">
            <a href="/args">
              <span>args</span>
            </a>
          </li>
          <li class="link">
            <a href="/args"><span>args</span></a>
          </li>
          <li class="search">
                <form action="/wiki/" method="get"><input type="text" name="query" placeholder="イレイナ">
<button class="searchformbtn">検索</button>
</form>
          </li>
        </ul>
      </div>
</div>
<br><br>`;