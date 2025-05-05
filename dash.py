import streamlit as st
import pandas as pd
from airtable import Airtable
import os
import base64
import plotly.express as px

# ——— Helper to load logo as base64 ———
def load_logo_b64(path="logo.png"):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

# ——— Airtable loader ———
AIRTABLE_API_KEY    = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE_ID    = st.secrets["AIRTABLE_BASE_ID"]
AIRTABLE_TABLE_NAME = st.secrets["AIRTABLE_TABLE_NAME"]

@st.cache_data
def load_data():
    at = Airtable(AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, api_key=AIRTABLE_API_KEY)
    recs = at.get_all(view="Grid view")
    rows = []
    for r in recs:
        f = r.get("fields", {})
        rows.append({
            "Name":            f.get("Name",""),
            "Firm":            f.get("Firm",""),
            "Referral Earned": pd.to_numeric(f.get("Referral Earned",0), errors="coerce")
        })
    df = pd.DataFrame(rows).fillna(0)
    # 1) sort descending
    df = df.sort_values("Referral Earned", ascending=False)
    # 2) reset_index dropping the old index
    df = df.reset_index(drop=True)
    # 3) assign new 1-based rank
    df.index = df.index + 1
    df["Rank"] = df.index
    return df

# ——— Inject CSS ———
with open("style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# ——— Centered Logo via base64 HTML ———
logo_b64 = load_logo_b64("logo.png")
st.markdown(
    f"<img src='data:image/png;base64,{logo_b64}' "
    "style='display:block;margin-left:auto;margin-right:auto;width:120px;'/>",
    unsafe_allow_html=True
)

# ——— Title ———
st.markdown(
    "<div style='text-align:center'>"
    "<h1>Handdi.io</h1>"
    "<h3>Agent Leaderboard</h3>"
    "</div>",
    unsafe_allow_html=True
)

df = load_data()

# ——— Top 3 Cards ———
st.title("🌟 Top 3 Agents by Referral Earned")
top3 = df.head(3).to_dict("records")
cols = st.columns(3, gap="large")
medals = {1: "🥇", 2: "🥈", 3: "🥉"}

for col, rec in zip(cols, top3):
    m = medals.get(rec["Rank"], f"#{rec['Rank']}")
    col.markdown(
        f"""
        <div class="top-card">
          <div class="card-medal">{m}</div>
          <h3 class="card-name">{rec['Name']}</h3>
          <div class="card-firm">{rec['Firm']}</div>
          <h3 class="card-metric">💰 ${rec['Referral Earned']:.2f}</h3>
        </div>
        """,
        unsafe_allow_html=True
    )

# ——— Full Table (top 25 only, proper Rank 1–25) ———
st.header("📊 Top 25 Agents")
top25 = df.head(25).set_index("Rank")[["Name","Firm","Referral Earned"]]
st.table(top25)

# ——— Referrer Origins Pie Chart ———
st.header("Referrer Origins")
fc = df["Firm"].value_counts().rename_axis("Firm").reset_index(name="Count")
fig = px.pie(fc, names="Firm", values="Count", hole=0)
fig.update_traces(textinfo="none", hovertemplate="%{label}: %{percent}<extra></extra>")
fig.update_layout(showlegend=True, legend_title_text="Firm")
st.plotly_chart(fig, use_container_width=True)
