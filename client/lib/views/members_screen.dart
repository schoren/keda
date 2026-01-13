import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/data_providers.dart';
import '../providers/auth_provider.dart';

class MembersScreen extends ConsumerStatefulWidget {
  const MembersScreen({super.key});

  @override
  ConsumerState<MembersScreen> createState() => _MembersScreenState();
}

class _MembersScreenState extends ConsumerState<MembersScreen> {
  late Future<List<Map<String, dynamic>>> _membersFuture;

  @override
  void initState() {
    super.initState();
    _loadMembers();
  }

  void _loadMembers() {
    setState(() {
      _membersFuture = ref.read(apiClientProvider).getMembers();
    });
  }

  Future<void> _removeMember(String memberId, String memberName) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Miembro'),
        content: Text('¿Estás seguro de que quieres eliminar a $memberName del hogar?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await ref.read(apiClientProvider).removeMember(memberId);
        _loadMembers();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Miembro eliminado')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      }
    }
  }

  void _showInviteDialog() {
    final emailController = TextEditingController();

    void submit() async {
      final email = emailController.text.trim();
      if (email.isEmpty) return;

      try {
        Navigator.pop(context); 
        await ref.read(apiClientProvider).createInvitation(email);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Invitación enviada con éxito')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error al enviar invitación: $e')),
          );
        }
      }
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Invitar Miembro'),
        content: TextField(
          controller: emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            hintText: 'ejemplo@gmail.com',
          ),
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.send,
          onSubmitted: (_) => submit(),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: submit,
            child: const Text('Enviar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentUserId = ref.watch(authProvider).userId;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Miembros del Hogar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add),
            tooltip: 'Invitar',
            onPressed: _showInviteDialog,
          ),
        ],
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _membersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final members = snapshot.data ?? [];

          return ListView.builder(
            itemCount: members.length,
            itemBuilder: (context, index) {
              final member = members[index];
              final isMe = member['id'] == currentUserId;

              return ListTile(
                leading: CircleAvatar(
                  child: Text(member['name'][0].toUpperCase()),
                ),
                title: Text(member['name'] + (isMe ? ' (Tú)' : '')),
                subtitle: Text(member['email']),
                trailing: !isMe
                    ? IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _removeMember(member['id'], member['name']),
                      )
                    : null,
              );
            },
          );
        },
      ),
    );
  }
}
