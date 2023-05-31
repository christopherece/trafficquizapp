from django.shortcuts import render, redirect
from questions.models import Question, Option
from django.http import JsonResponse

def index(request):
    questions = Question.objects.all()
    context = {
        'questions': questions
    }
    return render(request, 'pages/index.html', context)

# views.py
from django.shortcuts import render, redirect
from questions.models import Question, Option

def submit_quiz(request):
    if request.method == 'POST':
        # Process submitted answers and calculate the score
        score = 0
        answers = []

        total_questions = Question.objects.count()

        for question in Question.objects.all():
            selected_option_id = request.POST.get(f'q{question.id}')
            selected_option = Option.objects.get(id=selected_option_id)
            if selected_option.is_correct:
                score += 1
            answers.append({
                'question': question.text,
                'selected_option': selected_option.text,
                'is_correct': selected_option.is_correct,
                'explanation': question.explanation
            })

        # Calculate the score percentage
        score_percentage = round((score / total_questions) * 100,2)
        context = {
            'score': score,
            'total_questions': total_questions,
            'answers': answers,
            'score_percentage':score_percentage,
        }
        return render(request, 'pages/result.html', context)

    else:
        return redirect('index')



def result(request, score, total_questions, correct_answers):
    context = {
        'score': score,
        'total_questions': total_questions,
        'correct_answers': correct_answers
    }
    return render(request, 'pages/result.html', context)