import numpy as np
from scipy.optimize import linear_sum_assignment

def optimize(scores):
    # scores: P x R (higher is better)
    if scores.size == 0:
        return []
    cost = -scores  # maximize
    row_ind, col_ind = linear_sum_assignment(cost)
    return list(zip(row_ind.tolist(), col_ind.tolist()))
