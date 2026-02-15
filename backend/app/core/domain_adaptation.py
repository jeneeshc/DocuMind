from typing import Dict, Any

class DomainAdaptationToolkit:
    """
    Configurable toolkit to swap Knowledge Bases while retaining the Reasoning Engine.
    """
    
    DOMAINS = {
        "tax": {
            "stream_preference": "B",
            "keywords": ["Form 1040", "IRS", "Deduction"],
            "validation_rules": ["Check Numeric Total", "Verify SSN Format"]
        },
        "legal": {
            "stream_preference": "D",
            "keywords": ["Agreement", "Clause", "Liability", "Termination"],
            "validation_rules": ["Identify Parties", "Detect Expiration Date"]
        },
        "healthcare": {
            "stream_preference": "C",
            "keywords": ["Patient", "Diagnosis", "ICD-10", "Provider"],
            "validation_rules": ["Validate DOB", "Check HCPCS Codes"]
        }
    }

    def __init__(self, domain: str = "tax"):
        self.config = self.DOMAINS.get(domain, self.DOMAINS["tax"])

    def get_config(self) -> Dict[str, Any]:
        return self.config

    @classmethod
    def list_domains(cls):
        return list(cls.DOMAINS.keys())

domain_toolkit = DomainAdaptationToolkit()
