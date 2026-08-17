import torch

class ModelLoader:
    def __init__(self):
        print("Loading NLP Embedding Model...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            # Check torch version
            if torch.__version__ < "2.4":
                print("Disabling PyTorch because PyTorch >= 2.4 is required but found", torch.__version__)
                raise ImportError("PyTorch version too low")
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(
                "sentence-transformers/all-MiniLM-L6-v2",
                device=self.device
            )
            print("Model Loaded Successfully!")
        except Exception as e:
            print(f"Failed to load model: {e}")
            self.model = None

    def get_embedding(self, text: str):
        if self.model is None:
            return [0.0] * 384  # dummy embedding
        return self.model.encode(text)
