from services.text_analyzer import TextAnalyzer
from services.email_checker import EmailChecker
from services.url_checker import URLChecker
from services.urgency_detector import UrgencyDetector


class RiskEngine:
    """
    Main fraud detection engine that combines multiple signals
    to produce comprehensive risk assessment.

    This version includes a simple logistic regression model trained on
    the provided CSV dataset in `backend/data`.  The model predicts the
    probability that a posting is fraudulent based on a few basic
    numeric features and is used as an auxiliary score alongside the
    heuristic signals.  Training happens at initialization; if the
    dataset is missing or malformed the model is silently skipped.

    Weighting:
    - Text Similarity: 40%
    - Email Analysis: 20%
    - URL Analysis: 20%
    - Urgency Detection: 10%
    - Company Validation: 10%
    """

    # Weights for each signal
    WEIGHTS = {
        'text': 0.40,
        'email': 0.20,
        'url': 0.20,
        'urgency': 0.10,
        'company': 0.10
    }

    # Risk level thresholds (for the weighted heuristic score)
    RISK_LEVELS = {
        'low': (0, 35),
        'medium': (35, 70),
        'high': (70, 100)
    }

    def __init__(self):
        """Initialize all detection services and train logistic model."""
        self.text_analyzer = TextAnalyzer()
        self.email_checker = EmailChecker()
        self.url_checker = URLChecker()
        self.urgency_detector = UrgencyDetector()

        # logistic regression model (from sklearn).  If training fails,
        # the attribute remains None and downstream code will ignore it.
        self.model = None
        self._train_logistic_model()
    
    def analyze(self, title: str, description: str, email: str, website: str, company_name: str = "") -> dict:
        """
        Comprehensive fraud detection analysis.
        
        Args:
            title: Job title or posting title
            description: Full job description/posting text
            email: Contact email from posting
            website: Company website or posting URL
            company_name: Official company name (optional, for validation)
        
        Returns:
            Dictionary containing:
            {
                'final_risk_score': float (0-100),
                'risk_level': str ('Low', 'Medium', 'High'),
                'fraud_probability': float (0-1) if logistic model available,
                'signals': { ... }
            }
        """
        
        # Analyze each signal
        text_score = self._analyze_text(title, description)
        email_score = self._analyze_email(email, company_name)
        url_score = self._analyze_url(website)
        urgency_score = self._analyze_urgency(description)
        company_score = self._analyze_company(company_name)
        
        # Combine scores with weights (heuristic)
        heuristic_score = (
            text_score * self.WEIGHTS['text'] +
            email_score * self.WEIGHTS['email'] +
            url_score * self.WEIGHTS['url'] +
            urgency_score * self.WEIGHTS['urgency'] +
            company_score * self.WEIGHTS['company']
        )
        
        # Determine risk level from heuristic
        risk_level = self._get_risk_level(heuristic_score)

        result = {
            'final_risk_score': round(heuristic_score, 2),
            'risk_level': risk_level,
            'confidence': round((heuristic_score / 100) * 100, 2),
            'signals': {
                'text': {
                    'score': round(text_score, 2),
                    'weight': self.WEIGHTS['text'],
                    'description': 'Similarity to known scam patterns'
                },
                'email': {
                    'score': round(email_score, 2),
                    'weight': self.WEIGHTS['email'],
                    'description': 'Email address risk assessment'
                },
                'url': {
                    'score': round(url_score, 2),
                    'weight': self.WEIGHTS['url'],
                    'description': 'Website URL and domain reputation'
                },
                'urgency': {
                    'score': round(urgency_score, 2),
                    'weight': self.WEIGHTS['urgency'],
                    'description': 'Pressure and urgency tactics detected'
                },
                'company': {
                    'score': round(company_score, 2),
                    'weight': self.WEIGHTS['company'],
                    'description': 'Company validation and legitimacy'
                }
            }
        }

        # If logistic model was trained, include its prediction
        if self.model is not None:
            try:
                # build same feature vector as training
                f1 = len(title or "")
                f2 = len(description or "")
                prob_fraud = float(self.model.predict_proba([[f1, f2]])[0][1])
                result['fraud_probability'] = round(prob_fraud, 4)
                # compute safe confidence (probability that posting is NOT fraudulent)
                safe_confidence = 1.0 - prob_fraud
                result['safe_confidence'] = round(safe_confidence, 4)
                result['is_safe'] = safe_confidence >= 0.90
                # optionally adjust final risk score to model output
                result['model_risk_score'] = round(prob_fraud * 100, 2)

                # Model-based risk override: strict 90% threshold
                if result['is_safe']:
                    # >= 90% safe: show as Low risk (green)
                    result['risk_level'] = 'Low'
                    result['final_risk_score'] = round((1.0 - prob_fraud) * 100, 2)
                else:
                    # < 90% safe: force High risk (red) regardless of heuristic
                    result['risk_level'] = 'High'
                    result['final_risk_score'] = round(prob_fraud * 100, 2)
            except Exception as e:
                print(f"Error computing logistic model probability: {e}")
        
        return result
    
    def _analyze_text(self, title: str, description: str) -> float:
        """Analyze text using sentence embeddings."""
        try:
            combined_text = f"{title} {description}"
            score = self.text_analyzer.analyze(combined_text)
            return float(score)
        except Exception as e:
            print(f"Error in text analysis: {e}")
            return 0.0
    
    def _analyze_email(self, email: str, company_name: str = "") -> float:
        """Analyze email for suspicious patterns."""
        try:
            score = self.email_checker.analyze(email, company_name)
            return float(score)
        except Exception as e:
            print(f"Error in email analysis: {e}")
            return 0.0
    
    def _analyze_url(self, website: str) -> float:
        """Analyze URL for suspicious patterns."""
        try:
            score = self.url_checker.analyze(website)
            return float(score)
        except Exception as e:
            print(f"Error in URL analysis: {e}")
            return 0.0
    
    def _analyze_urgency(self, description: str) -> float:
        """Detect urgency and pressure tactics."""
        try:
            score = self.urgency_detector.analyze(description)
            return float(score)
        except Exception as e:
            print(f"Error in urgency detection: {e}")
            return 0.0
    
    def _analyze_company(self, company_name: str) -> float:
        """
        Validate company legitimacy.
        This is a placeholder for future company validation API integration.
        """
        try:
            # Placeholder: Basic validation
            if not company_name or len(company_name.strip()) == 0:
                return 40.0  # No company name = higher risk
            
            if len(company_name.strip()) < 2:
                return 50.0  # Too short = suspicious
            
            # If company name exists, assume lower risk (0)
            return 0.0
        except Exception as e:
            print(f"Error in company validation: {e}")
            return 20.0
    
    def _get_risk_level(self, score: float) -> str:
        """
        Convert numeric risk score to risk level.
        
        Args:
            score: Risk score (0-100)
        
        Returns:
            Risk level: 'Low', 'Medium', or 'High'
        """
        if score < self.RISK_LEVELS['low'][1]:
            return 'Low'
        elif score < self.RISK_LEVELS['medium'][1]:
            return 'Medium'
        else:
            return 'High'

    def _train_logistic_model(self):
        """Train a simple logistic regression on the CSV dataset."""
        try:
            import csv
            from sklearn.linear_model import LogisticRegression
            from pathlib import Path

            csv_path = Path(__file__).parent.parent / 'backend' / 'data' / 'Fake_Real_Job_Posting.csv'
            if not csv_path.exists():
                print("Logistic model training skipped; dataset not found.")
                return

            X = []
            y = []
            with open(csv_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    fraud = str(row.get('fraudulent', '')).strip().lower()
                    if fraud == '':
                        continue
                    target = 1 if fraud != 'real' else 0
                    title = row.get('title', '') or ''
                    req = row.get('requirements', '') or ''
                    X.append([len(title), len(req)])
                    y.append(target)

            if len(set(y)) < 2 or len(X) < 10:
                print("Not enough data to train logistic model.")
                return

            model = LogisticRegression(max_iter=1000)
            model.fit(X, y)
            self.model = model
            print("Logistic regression model trained with", len(X), "rows")
        except Exception as e:
            print(f"Failed to train logistic regression model: {e}")
            self.model = None