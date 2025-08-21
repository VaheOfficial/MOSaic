from bs4 import BeautifulSoup
from typing import Dict, Any
import re

LABEL_MAP = {
    'Gr/DOR': ('grade','date_of_rank'),
    'Name': ('name',),
    'SSAN': ('ssn_last4',),
    'Proj Gr': ('projected_grade',),
    'DAFSC': ('dafsc',),
    'Duty Title': ('duty_title',),
    'PAS': ('pas',),
    'Base': ('base',),
    'Command': ('command',),
    'Dependents': ('dependents',),
    'Sex/Race/Eth': ('sex_race_eth',),
    # service dates
    'DAS': ('das',),
    'DOS': ('dos',),
    'HYT': ('hyt',),
    'DEROS': ('deros',),
    'ADSCD': ('adscd',),
    'TAFMSD': ('tafmsd',),
    'ODSD': ('odsd',),
    'EAD': ('ead',),
    'PAY DATE': ('pay_date',),
    'STRD': ('strd',),
    # afsc info
    'CAFSC': ('cafsc',),
    'PAFSC': ('pafsc',),
    '2AFSC': ('afsc2',),
    '3AFSC': ('afsc3',),
    'PSEI': ('psei',),
    'Weapon System Background ID': ('weapon_system_background_id',),
    'Return to Fly Date': ('return_to_fly_date',),
}

def _clean(text:str)->str:
    return re.sub(r'\s+', ' ', (text or '').strip())

def parse_surf_html(html: str) -> Dict[str, Any]:
    soup = BeautifulSoup(html, 'lxml')
    text = soup.get_text(" ", strip=True)

    data = {
        "header": {"printed_by": None, "printed_at": None, "as_of": None, "privacy_notice": None},
        "identity": {},
        "service_dates": {},
        "afsc_info": {},
        "assignments": [],
        "decorations": [],
        "pme": []
    }

    # Header lines like "Printed By ... Current as of ..."
    header_candidates = soup.find_all(string=re.compile(r"Printed By|Current as of", re.I))
    if header_candidates:
        header_blob = " ".join([_clean(s) for s in header_candidates])
        data["header"]["printed_by"] = header_blob

    # Generic label:value extraction by bold tags or <b>Label:</b> Value
    for b in soup.find_all(['b','strong']):
        label = _clean(b.get_text())
        # normalize trailing colon
        label = label.rstrip(':')
        if label in LABEL_MAP:
            # value might be in same parent node after bold
            value = ''
            # iterate following siblings until non-empty text
            for sib in b.next_siblings:
                if getattr(sib, 'name', None) in ('b','strong'):
                    break
                if isinstance(sib, str):
                    chunk = _clean(sib)
                else:
                    chunk = _clean(sib.get_text(" ", strip=True))
                if chunk:
                    value += (" " + chunk if value else chunk)
            value = _clean(value)

            keys = LABEL_MAP[label]
            if label == 'Gr/DOR':
                # Expect "SRA/16-May-2024" -> split by '/'
                parts = [p.strip() for p in value.split('/')]
                if len(parts) >= 2:
                    data["identity"]["grade"] = parts[0]
                    data["identity"]["date_of_rank"] = parts[1]
                else:
                    data["identity"]["grade"] = value
            elif label in ['DAS','DOS','HYT','DEROS','ADSCD','TAFMSD','ODSD','EAD','PAY DATE','STRD']:
                # service dates
                key = keys[0]
                data["service_dates"][key] = value
            elif label in ['CAFSC','PAFSC','2AFSC','3AFSC','PSEI','Weapon System Background ID','Return to Fly Date']:
                key = keys[0]
                data["afsc_info"][key] = value
            else:
                # identity defaults
                key = keys[0]
                if key == 'ssn_last4':
                    # keep last 4 only
                    m = re.search(r'(\d{4})$', value)
                    if m:
                        value = m.group(1)
                data["identity"][key] = value

    return data
