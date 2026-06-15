"""
One-time script: convert sign_language_model.keras → sign_language_model.tflite
Run this LOCALLY (where tensorflow is installed), then commit the .tflite file.
"""
import tensorflow as tf
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KERAS_PATH = os.path.join(BASE_DIR, "sign_language_model.keras")
TFLITE_PATH = os.path.join(BASE_DIR, "sign_language_model.tflite")

print(f"Loading Keras model from: {KERAS_PATH}")
model = tf.keras.models.load_model(KERAS_PATH)
model.summary()

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # quantize for smaller size
tflite_model = converter.convert()

# Save
with open(TFLITE_PATH, "wb") as f:
    f.write(tflite_model)

size_kb = os.path.getsize(TFLITE_PATH) / 1024
print(f"\n✅ Saved TFLite model to: {TFLITE_PATH}")
print(f"   Size: {size_kb:.1f} KB")

# Quick verification
interpreter = tf.lite.Interpreter(model_path=TFLITE_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
print(f"   Input shape:  {input_details[0]['shape']}  dtype: {input_details[0]['dtype']}")
print(f"   Output shape: {output_details[0]['shape']} dtype: {output_details[0]['dtype']}")
